(function() {
  'use strict';

  describe( 'iscFormFieldLayoutService', function() {
    var suite = {};

    useDefaultFormsModules();

    beforeEach( inject( function( $httpBackend, iscFormsApi, iscFormFieldLayoutService ) {
      suite = window.createSuite( {
        $httpBackend             : $httpBackend,
        iscFormsApi              : iscFormsApi,
        iscFormFieldLayoutService: iscFormFieldLayoutService
      } );

      mockFormResponses( suite.$httpBackend );
    } ) );

    // -------------------------
    describe( 'transformContainer', function() {
      it( 'should mutate field containers and fields by changing className', function() {
        var service = suite.iscFormFieldLayoutService;
        spyOn( service, 'transformContainer' ).and.callThrough();

        // Expectations below are based on the mock dataLayout.json file
        suite.iscFormsApi.getFormDefinition( 'dataLayout' ).then( runTest );
        suite.$httpBackend.flush();

        function runTest( form ) {
          _.forEach( form.pages, function( page ) {
            service.transformContainer( page, true );
          } );

          var page, fieldGroup;


          // Page 1 - Column properties as a primitive: e.g.,
          //   data.layout.columns = 2
          page       = form.pages[0];
          fieldGroup = getFieldGroup( page );

          expect( page.className ).toContain( "small-up-2" );
          expect( fieldGroup.className ).toContain( "small-up-3" );
          // (existing className should be preserved)
          expect( fieldGroup.className ).toContain( "testing-nested-layout" );


          // Page 2 - Column properties by breakpoint: e.g.,
          //   data.layout.columns.small  = 2
          //   data.layout.columns.medium = 3
          page       = form.pages[1];
          fieldGroup = getFieldGroup( page );

          expect( page.className ).toContain( "small-up-1" );
          expect( page.className ).toContain( "medium-up-2" );
          expect( page.className ).toContain( "large-up-3" );
          expect( fieldGroup.className ).toContain( "small-up-4" );
          expect( fieldGroup.className ).toContain( "medium-up-5" );
          expect( fieldGroup.className ).toContain( "large-up-6" );
          // (existing className should be preserved)
          expect( fieldGroup.className ).toContain( "testing-nested-layout" );


          // Page 3 - Column widths set by percentages: e.g.,
          //    data.layout.columns.1 = '90%'
          //    data.layout.columns.2 = '10%'
          page       = form.pages[2];
          fieldGroup = getFieldGroup( page );

          // The minimum breakpoint from the config is used for primitive percentage settings 
          expect( page.fields[0].className ).toContain( 'formly-field-small-90' );
          expect( page.fields[1].className ).toContain( 'formly-field-small-10' );
          expect( page.fields[2].className ).toContain( 'formly-field-small-90' );
          expect( page.fields[3].className ).toContain( 'formly-field-small-10' );

          expect( fieldGroup.fieldGroup[0].className ).toContain( 'formly-field-small-80' );
          expect( fieldGroup.fieldGroup[1].className ).toContain( 'formly-field-small-20' );
          expect( fieldGroup.fieldGroup[2].className ).toContain( 'formly-field-small-80' );
          expect( fieldGroup.fieldGroup[3].className ).toContain( 'formly-field-small-20' );


          // Page 4 - Column widths set by percentages and breakpoint: e.g.,
          //    data.layout.columns.small.1 = '90%'
          //    data.layout.columns.small.2 = '10%'
          //    data.layout.columns.large.1 = '40%'
          //    data.layout.columns.large.2 = '30%'
          //    data.layout.columns.large.3 = '20%'
          //    data.layout.columns.large.4 = '10%'
          page       = form.pages[3];
          fieldGroup = getFieldGroup( page );

          // Small is two columns
          expect( page.fields[0].className ).toContain( 'formly-field-small-90' );
          expect( page.fields[1].className ).toContain( 'formly-field-small-10' );
          expect( page.fields[2].className ).toContain( 'formly-field-small-90' );
          expect( page.fields[3].className ).toContain( 'formly-field-small-10' );
          // Large is four columns
          expect( page.fields[0].className ).toContain( 'formly-field-large-40' );
          expect( page.fields[1].className ).toContain( 'formly-field-large-30' );
          expect( page.fields[2].className ).toContain( 'formly-field-large-20' );
          expect( page.fields[3].className ).toContain( 'formly-field-large-10' );

          // Small is two columns
          expect( fieldGroup.fieldGroup[0].className ).toContain( 'formly-field-small-80' );
          expect( fieldGroup.fieldGroup[1].className ).toContain( 'formly-field-small-20' );
          expect( fieldGroup.fieldGroup[2].className ).toContain( 'formly-field-small-80' );
          expect( fieldGroup.fieldGroup[3].className ).toContain( 'formly-field-small-20' );
          // Large is four columns
          expect( fieldGroup.fieldGroup[0].className ).toContain( 'formly-field-large-40' );
          expect( fieldGroup.fieldGroup[1].className ).toContain( 'formly-field-large-30' );
          expect( fieldGroup.fieldGroup[2].className ).toContain( 'formly-field-large-20' );
          expect( fieldGroup.fieldGroup[3].className ).toContain( 'formly-field-large-10' );

        }

        function getFieldGroup( page ) {
          return _.find( page.fields, "fieldGroup" );
        }
      } );

    } );

  } );
})();

