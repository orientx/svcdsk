  'use strict';
  $(document).ready(function() {

      $('.dropdown-toggle').dropdown();
      $('.dropdown-menu.dropdown-menu').click(function(e) {
          if ($('#searchText').val() == '') {
              $('.alert.alert-danger.alert-dismissible').fadeIn(1000);
              $('#searchText').focus();
              return;
          }
          search($(this).find('li a').data('type'));
      });

      $('#searchText').keyup(function(e) {
          $('.alert.alert-danger.alert-dismissible').fadeOut(1000);
      });
  });

  function search(searchType) {

      //var query={{'searchType':searchType},{'searchText':$('#searchText').val()}}
      //var url = '/question/' + query;
      //var url = '/question?searchType=' + searchType + '&searchText=' + $('#searchText').val();
      //alert(url);
      //$(location).attr('href', url);

      $('#searchType').val(searchType);
      $('form').submit();
      
  }
