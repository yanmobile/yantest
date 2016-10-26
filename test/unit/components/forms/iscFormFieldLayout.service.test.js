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
          _.forEach( form.sections, function( section ) {
            service.transformContainer( section, true );
          } );

          var section, fieldGroup;


          // Section 1 - Column properties as a primitive: e.g.,
          //   data.layout.columns = 2
          section    = form.sections[0];
          fieldGroup = getFieldGroup( section );

          expect( section.className ).toContain( "small-up-2" );
          expect( fieldGroup.className ).toContain( "small-up-3" );
          // (existing className should be preserved)
          expect( fieldGroup.className ).toContain( "testing-nested-layout" );


          // Section 2 - Column properties by breakpoint: e.g.,
          //   data.layout.columns.small  = 2
          //   data.layout.columns.medium = 3
          section    = form.sections[1];
          fieldGroup = getFieldGroup( section );

          expect( section.className ).toContain( "small-up-1" );
          expect( section.className ).toContain( "medium-up-2" );
          expect( section.className ).toContain( "large-up-3" );
          expect( fieldGroup.className ).toContain( "small-up-4" );
          expect( fieldGroup.className ).toContain( "medium-up-5" );
          expect( fieldGroup.className ).toContain( "large-up-6" );
          // (existing className should be preserved)
          expect( fieldGroup.className ).toContain( "testing-nested-layout" );


          // Section 3 - Column widths set by percentages: e.g.,
          //    data.layout.columns.1 = '90%'
          //    data.layout.columns.2 = '10%'
          section    = form.sections[2];
          fieldGroup = getFieldGroup( section );

          // The minimum breakpoint from the config is used for primitive percentage settings 
          expect( section.fields[0].className ).toContain( 'formly-field-small-90' );
          expect( section.fields[1].className ).toContain( 'formly-field-small-10' );
          expect( section.fields[2].className ).toContain( 'formly-field-small-90' );
          expect( section.fields[3].className ).toContain( 'formly-field-small-10' );

          expect( fieldGroup.fieldGroup[0].className ).toContain( 'formly-field-small-80' );
          expect( fieldGroup.fieldGroup[1].className ).toContain( 'formly-field-small-20' );
          expect( fieldGroup.fieldGroup[2].className ).toContain( 'formly-field-small-80' );
          expect( fieldGroup.fieldGroup[3].className ).toContain( 'formly-field-small-20' );


          // Section 4 - Column widths set by percentages and breakpoint: e.g.,
          //    data.layout.columns.small.1 = '90%'
          //    data.layout.columns.small.2 = '10%'
          //    data.layout.columns.large.1 = '40%'
          //    data.layout.columns.large.2 = '30%'
          //    data.layout.columns.large.3 = '20%'
          //    data.layout.columns.large.4 = '10%'
          section    = form.sections[3];
          fieldGroup = getFieldGroup( section );

          // Small is two columns
          expect( section.fields[0].className ).toContain( 'formly-field-small-90' );
          expect( section.fields[1].className ).toContain( 'formly-field-small-10' );
          expect( section.fields[2].className ).toContain( 'formly-field-small-90' );
          expect( section.fields[3].className ).toContain( 'formly-field-small-10' );
          // Large is four columns
          expect( section.fields[0].className ).toContain( 'formly-field-large-40' );
          expect( section.fields[1].className ).toContain( 'formly-field-large-30' );
          expect( section.fields[2].className ).toContain( 'formly-field-large-20' );
          expect( section.fields[3].className ).toContain( 'formly-field-large-10' );

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

        function getFieldGroup( section ) {
          return _.find( section.fields, "fieldGroup" );
        }
      } );

    } );

  } );
})();

