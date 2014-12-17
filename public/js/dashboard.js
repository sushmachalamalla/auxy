$(function(){
  $('#profile-link').on('click', function(){
    getUsersData();
  }) // #profile-link click

  // Approve
  $('#approve-requests').on('click', function(event){
    event.preventDefault();
    var requestTable = $('#requestsTable');
    var checked = requestTable.find('tbody tr input[type=checkbox]:checked');

    if (typeof checked !== 'undefined') {
      var approved = [];
      $.each(checked, function(index, val){
        approved.push(val.id);
      })

      if (approved.length > 0) {
        $.ajax({
          url: '/users',
          type: 'POST',
          data:  {usersIdsToApprove: approved },
          contentType: "application/x-www-form-urlencoded",
          success: function(data){
            console.log(JSON.stringify(data));
          }
        })
        getUsersData();
      }
    }
  });

  // Check uncheck
  $("#requestsTable #checkall").click(function () {
    if ($("#requestsTable #checkall").is(':checked')) {
      $("#requestsTable input[type=checkbox]").each(function () {
        $(this).prop("checked", true);
      });

    } else {
      $("#requestsTable input[type=checkbox]").each(function () {
        $(this).prop("checked", false);
      });
    }
  });

  $('#requestsTable').on('click', 'input:not(.checkall)', function () {
    var total = $('#requestsTable').find('tbody tr input:not(.checkall)').length;
    var checked = $('#requestsTable').find('tbody tr input:not(.checkall):checked').length;
    if (total == checked) {
      $('#requestsTable').find('#checkall').prop('indeterminate', false);
      $('#requestsTable').find('#checkall').prop('checked', true);
    } else if (checked == 0) {
      $('#requestsTable').find('#checkall').prop('indeterminate', false);
      $('#requestsTable').find('#checkall').prop('checked', false);
    } else {
      $('#requestsTable').find('#checkall').prop('indeterminate', true);
    }
  });
})

var getUsersData = function(){
  $.get('/users?status=0')
  .done(function(data){
    if (typeof data !== 'undefined') {

      //grab the table
      var requestTable = $('#requestsTable');
      if (typeof requestTable !== 'undefined') {
        //clear existing
        $(requestTable).find('tbody').html("");

        //construct the data
        var rows = "";
        $.each(data, function(index, row){
          rows = rows
          + "<tr id=" + row.id + ">"
          + "<td><input id=" + row.id + " type='checkbox' /> </td>"
          + "<td><p>" + row.email+"</p></td>"
          + "<td><p>" + (row.status == 0 ? "Pending" : "Approved") +"</p></td>"
          + "<td><p>" + (row.isAdmin == true ? "Yes" : "No")+"</p></td>"
          + "</tr>"
        });

        $(requestTable).find('tbody').append(rows);
        $('#requestsTable').find('#checkall').prop('indeterminate', false);
        $('#requestsTable').find('#checkall').prop('checked', false);
      }

    }//if

  }); //done
}
