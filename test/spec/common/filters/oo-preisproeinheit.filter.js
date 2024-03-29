describe('Filter: ooPreisProEinheit', function() {
  'use strict';

  var $filter;
  var gettextCatalog;
  var $rootScope;

  beforeEach(function() {
    module('openolitor-core');

    inject(function(_$filter_) {
      $filter = _$filter_;
    });

    inject(function(_gettextCatalog_) {
      gettextCatalog = _gettextCatalog_;
    });

    inject(function(_$rootScope_) {
      $rootScope = _$rootScope_;
    });
  });

  it('format preis + preisEinheit + waehrung to single string', function() {
    gettextCatalog.setCurrentLanguage('de_CH');
    $rootScope.projekt = { waehrung: 'CHF'};

    var input = {
      preis: 3,
      preiseinheit: 'Tag',
      waehrung: 'CHF'
    };

    var result = $filter('ooPreisProEinheit')(input,input.waehrung);

    expect(result).toEqual('CHF 3.00 pro Tag');
  });
});
