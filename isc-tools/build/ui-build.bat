:: Batch script to build a UIFW-derived UI as part of the InterSystems nightly/release build environment

:: Open Questions:
::   1. Dependencies: how do we want to manage dependencies? At present those include:
::       a. node
::       b. npm
::       c. portablegit
::       d. python
::      We already use executables for node and portablegit, so those aren't too complicated to pull in.
::      The tricky ones are npm, where the source is sufficient, and python, where we need python built on the Windows machine
::      We have a further question 

:: General flag to capture any error states - 0 means OK
SET RETURNCODE=0

:: Set debugging-driven flags
SET ROBOCOPYLOGGING=/NFL /NDL
IF "%MODE%"=="debug" (
	SET ROBOCOPYLOGGING=
)

SET origdir=%CD%
SET hsuidir=%1%
SET hsprojectname=%2
SET hsnodeprojectname=%3
SET gulpbuildcommand=%4
SET hsdbname=%5
IF "%gulpbuildcommand%"=="" (
	SET gulpbuildcommand=deploy
)
SET oldpath=%PATH%
CD %hsuidir%
SET hsuidir=%CD%
SET popdepshare=0
SET popuishare=0
SET baseuidir=%hsuidir%\..
SET builtroot=%origdir%\..\..\built\%PLATFORM%\%MODE%
PUSHD %builtroot%
SET builtroot=%CD%
POPD
SET builtdir=%builtroot%\%hsprojectname%
SET nodedir=%builtroot%\%hsnodeprojectname%\node
IF NOT EXIST %nodedir% (
	ECHO node directory %nodedir% does not exist
	SET RETURNCODE=1
	GOTO End
)

SET thirdpartydir=%hsuidir%\..\..\thirdparty
PUSHD %thirdpartydir%
SET thirdpartydir=%CD%
POPD

SET copy_loc_strings=0
IF NOT "%hsdbname%"=="" (
	SET localizedir=%hsuidir%\..\..\databases\%hsdbname%\localize
	SET copy_loc_strings=1
)
IF %copy_loc_strings% (
	IF NOT EXIST %localizedir% (
		MKDIR %localizedir%
	)
	PUSHD %localizedir%
	SET localizedir=%CD%
	POPD
)
:: Use a random suffix to avoid collisions
SET tempsuffix=%RANDOM%
SET builtshare=hsui_built_%hsprojectname%_%tempsuffix%

:: Make sure that builtdir is clean
:: We use NET SHARE to reduce the directory depth because Windows can struggle with paths below node_modules,
:: and this approach allows us to get a drive letter allocated without us being susceptible to timing problems
:: if we try to find an unused drive letter and then use SUBST.
IF EXIST %builtdir% (
	NET SHARE %builtshare%=%builtroot% /GRANT:%USERNAME%,FULL /USERS:1
	PUSHD \\localhost\%builtshare%
	IF EXIST %hsprojectname% (
		RMDIR /S /Q %hsprojectname%
	)
	POPD
	NET share %builtshare% /DELETE /YES
	RMDIR /S /Q %builtdir%
)
:: Copy all files to built\projectname and make writable
ROBOCOPY %hsuidir% %builtdir% /S /A-:R /NP %ROBOCOPYLOGGING%

:: Python needs to precede the path to any other versions of python, especially if we're in Cygwin
SET hsuipython=%builtroot%\hs_ui_python\PCbuild
SET PATH=%hsuipython%;%PATH%;%nodedir%;
SET PYTHON=%hsuipython%\python.exe

SET uishare=hsui_%hsprojectname%_%tempsuffix%
SET depshare=hsdep_%hsprojectname%_%tempsuffix%

:: Use NET SHARE to allocate temp drive letters
:: For dependencies in thirdparty/
NET SHARE %depshare%=%thirdpartydir% /GRANT:%USERNAME%,FULL /USERS:1
PUSHD \\localhost\%depshare%
SET popdepshare=1
SET depsharedir=%CD%

:: For the actual source code
NET SHARE %uishare%=%builtdir% /GRANT:%USERNAME%,FULL /USERS:1
PUSHD \\localhost\%uishare%
SET popuishare=1
SET uisharedir=%CD%

:: Remove any existing content in node_modules
IF EXIST %uisharedir%\node_modules (
	RMDIR /S /Q %uisharedir%\node_modules
)

:: Specify use of local npm cache
SET npm_config_cache=%uisharedir%\.npm-cache

:: Remove any existing data in local npm cache
IF EXIST %npm_config_cache% (
	RMDIR /S /Q %npm_config_cache%
)

:: Build dependencies
SET NODE_PATH=%nodedir%\node_modules
SET PATH=%PATH%%CD%node_modules\.bin;

:: Add portable git to path on same line to avoid problems with parentheses in path
IF EXIST %depsharedir%portablegit-2.7.2-win-x86-exe\cmd\ SET path=%PATH%%depsharedir%portablegit-2.7.2-win-x86-exe\cmd;

SET npmloglevel=warn
IF "%MODE%"=="debug" (
	SET npmloglevel=silly
)

:: Add debugging to get more details about actual build environment
IF "%MODE%"=="debug" (
	ECHO Debugging node/npm environment...
	CALL node --version
	CALL npm --version
	CALL npm config get cache
	CALL where python
	CALL python --version
	ECHO %PYTHON%
)

:: If isc-tools\npm-shrinkwrap-online.json is present, overwrite npm-shrinkwrap.json with that file
IF EXIST %uisharedir%\isc-tools\npm-shrinkwrap-online.json (
	IF EXIST npm-shrinkwrap.json (
		DEL /F /Q npm-shrinkwrap.json
	)
	COPY /Y isc-tools\npm-shrinkwrap-online.json npm-shrinkwrap.json
	IF ERRORLEVEL 1 (
		SET RETURNCODE=1
		GOTO End
	)
)

:: Run npm install in:
::  1. root directory
::  2. src/components/foundation/base
::  3. src/common
::  4. src/app

CALL :RunNpmInstall %CD%
IF ERRORLEVEL 1 (
	SET RETURNCODE=1
	GOTO End
)

CALL :RunNpmInstall %uisharedir%\src\components\foundation\base
IF ERRORLEVEL 1 (
	SET RETURNCODE=1
	GOTO End
)

CALL :RunNpmInstall %uisharedir%\src\common
IF ERRORLEVEL 1 (
	SET RETURNCODE=1
	GOTO End
)

CALL :RunNpmInstall %uisharedir%\src\app
IF ERRORLEVEL 1 (
	SET RETURNCODE=1
	GOTO End
)

@ECHO ON

:: Make sure we are in the UI root directory
CD %uisharedir%

IF EXIST www (
	RMDIR /S /Q www
)
IF EXIST dist (
	RMDIR /S /Q dist
)

:: Run gulp (deploy|build)
CALL gulp %gulpbuildcommand%
IF ERRORLEVEL 1 (
	SET RETURNCODE=1
	GOTO End
)

:: Cleanup tag that ALL code paths should exit through
:: Needed to make sure that we correctly clean up any network shares that linger
:: and change back into the original directory
:End
@ECHO ON

IF "%popuishare%"=="1" (
	POPD
)
IF "%popdepshare%"=="1" (
	POPD
)
IF NOT "%uishare%" == "" (
	NET share %uishare% /delete /yes
)
IF NOT "%depshare%" == "" (
	NET share %depshare% /delete /yes
)

SET path=%oldpath%
CD %origdir%

EXIT /B %RETURNCODE%

:: End of main routine
:: ----------------------------------------------------

:: Sub-routine to perform npm install in a target directory specified in argument 1
:RunNpmInstall

PUSHD %1

ECHO Running 'npm install --loglevel %npmloglevel%' in directory '%CD%'

CALL npm install --loglevel %npmloglevel% || EXIT /B 1
@ECHO ON

POPD

EXIT /B 0