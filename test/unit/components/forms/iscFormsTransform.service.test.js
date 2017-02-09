(function() {
  'use strict';

  //--------------------
  describe( 'iscFormsTransformService', function() {
    window.useDefaultTranslateBeforeEach();

    useDefaultFormsModules();

    beforeEach( inject( function( $httpBackend, $timeout,
      formlyApiCheck, formlyConfig,
      iscFormsTransformService ) {

      formlyConfig.disableWarnings   = true;
      formlyApiCheck.config.disabled = true;

      suiteMain = window.createSuite( {
        $httpBackend: $httpBackend,
        $timeout    : $timeout,

        iscFormsTransformService: iscFormsTransformService
      } );
      mockFormResponses( suiteMain.$httpBackend );
    } ) );

    describe( 'ensureBackwardsCompatibility', function() {
      var legacyFdn, expectedFdn;

      beforeEach( function() {
        legacyFdn = [
          {
            data: {
              tableHeaderLabel    : "legacy header",
              tableCellType       : "legacy type",
              tableCellTemplate   : "legacy template",
              tableCellTemplateUrl: "legacy templateUrl",
              tableCellDisplay    : "legacy display"
            }
          },
          {
            data: {
              computedField: {
                template   : "legacy computedTemplate",
                templateUrl: "legacy computedTemplateUrl"
              }
            }
          }
        ];

        expectedFdn = [
          {
            data: {
              collections: {
                tableCell: {
                  headerLabel: "legacy header",
                  type       : "legacy type",
                  template   : "legacy template",
                  templateUrl: "legacy templateUrl",
                  display    : "legacy display"
                }
              }
            }
          },
          {
            data: {
              computedField: {}, // this will still be in the original
              collections  : {
                tableCell: {
                  template   : "legacy computedTemplate",
                  templateUrl: "legacy computedTemplateUrl"
                }
              }
            }
          }
        ];
      } );

      it( 'should transform legacy FDN to new syntax', function() {
        spyOn( suiteMain.iscFormsTransformService, 'ensureBackwardsCompatibility' ).and.callThrough();
        var transformedFdn = suiteMain.iscFormsTransformService.ensureBackwardsCompatibility( legacyFdn );
        expect( expectedFdn ).toEqual( transformedFdn );
      } );

      it( 'should not modify the source if a new property is already set', function() {
        spyOn( suiteMain.iscFormsTransformService, 'ensureBackwardsCompatibility' ).and.callThrough();
        var alreadySet = {
          data: {
            collections: {
              tableCell: {
                headerLabel: 'already set'
              }
            }
          }
        };

        _.merge( legacyFdn[0], alreadySet );
        _.merge( expectedFdn[0], alreadySet );
        _.set( expectedFdn[0], 'data.tableHeaderLabel', 'legacy header' );

        var transformedFdn = suiteMain.iscFormsTransformService.ensureBackwardsCompatibility( legacyFdn );

        expect( expectedFdn ).toEqual( transformedFdn );
      } );
    } );
  } );
})();