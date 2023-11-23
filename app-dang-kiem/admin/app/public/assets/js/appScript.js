$(function () {
  $('#myTable').DataTable();
  var table = $('#example').DataTable({
    columnDefs: [
      {
        visible: false,
        targets: 2,
      },
    ],
    order: [[2, 'asc']],
    displayLength: 25,
    drawCallback: function (settings) {
      var api = this.api();
      var rows = api
        .rows({
          page: 'current',
        })
        .nodes();
      var last = null;
      api
        .column(2, {
          page: 'current',
        })
        .data()
        .each(function (group, i) {
          if (last !== group) {
            $(rows)
              .eq(i)
              .before('<tr class="group"><td colspan="5">' + group + '</td></tr>');
            last = group;
          }
        });
    },
  });
  $('#example tbody').on('click', 'tr.group', function () {
    var currentOrder = table.order()[0];
    if (currentOrder[0] === 2 && currentOrder[1] === 'asc') {
      table.order([2, 'desc']).draw();
    } else {
      table.order([2, 'asc']).draw();
    }
  });
  $('#config-table').DataTable({
    responsive: true,
  });
  $('#config-table-category').DataTable({
    responsive: true,
    dom: 'lBfrtip',
    buttons: [
      {
        extend: 'excelHtml5',
        exportOptions: {
          columns: ':not(:last-child)',
        },
      },
    ],
  });
  $('#example23').DataTable({
    responsive: true,
    dom: 'lBrtip',
    buttons: ['excel', 'print'],
  });
  $('.buttons-excel, .buttons-print').addClass('btn btn-success ml-2');
});
$(function () {
  $('input[name="daterange"]').daterangepicker({
    autoUpdateInput: false,
    locale: {
      format: 'DD/MM/YYYY',
      cancelLabel: 'Clear',
    },
  });

  $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(
      picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY')
    );

    $('.myForm').submit();
  });

  $('input[name="daterange"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
});

$("input[data-type='currency']").on({
  keyup: function () {
    formatCurrency($(this));
  },
  blur: function () {
    formatCurrency($(this), 'blur');
  },
});

function formatNumber(n) {
  return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatCurrency(input, blur) {
  var input_val = input.val();
  if (input_val === '') {
    return;
  }
  var original_len = input_val.length;
  var caret_pos = input.prop('selectionStart');
  input_val = formatNumber(input_val);

  input.val(input_val);
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}

var faqs_row = 0;

function addNewRow() {
  html = '<tr id="faqs-row' + faqs_row + '">';
  html +=
    '<td><div class="row"><div class="col-md-6"><div class="row"><label class="control-label text-end col-md-2">Từ</label><div class="col-md-10"><div class="input-group"><input type="text" id="from" name="from" class="form-control form-control-label" aria-label="Amount (to the nearest dollar)" placeholder="0"> <div class="input-group-append"><span class="input-group-text">km</span> </div> </div></div></div></div><div class="col-md-6"><div class="row"> <label class="control-label text-end col-md-2">Đến </label> <div class="col-md-10"> <div class="input-group"><input type="text" id="to" name="to" class="form-control form-control-label" aria-label="Amount (to the nearest dollar)" placeholder="0"> <div class="input-group-append"> <span class="input-group-text">km</span></div></div></div></div></div></div></td>';
  html +=
    '<td><div class="input-group"><input type="text" id="fee" name="fee" class="form-control form-control-label" aria-label="Amount (to the nearest dollar)" placeholder="11"><div class="input-group-append"><span class="input-group-text">đ</span></div></div></td>';
  html +=
    '<td class="mt-10"><button type="button" class="btn p-0" onclick="$(\'#faqs-row' +
    faqs_row +
    '\').remove();"><img src="/assets/images/Delete.svg" title="Xóa" /></button></td>';

  html += '</tr>';

  $('#faqs tbody').append(html);

  faqs_row++;
}

$(function () {
  $('#infringe_date').datepicker({
    format: 'dd/mm/yyyy',
  });
});

var carMaskBehavior = function (val) {
  code = val.charAt(3);
  return isNaN(parseFloat(code)) && code != ' ' ? 'AAAA - AAAAAAAA' : 'AAA - AAAAAAAA';
};
spOptions = {
  onKeyPress: function (val, e, field, options) {
    field.mask(carMaskBehavior.apply({}, arguments), options);
  },
};
$('#license_plate').mask(carMaskBehavior, spOptions);

$(document).ready(function () {
  $('#check-data').click(function () {
    $.ajax({
      url: '/management/check',
      type: 'POST',
      data: $('form').serialize(),
      dataType: 'json',
      success: function (data) {
        $('.check-data-mess').text(data.conflictError);
      },
    });
  });
});
$('#submit-close-modal').click(function () {
  $('#exampleModalCenter').modal('hide');
});

$('form').submit(function () {
  var this_master = $(this);
  this_master.find('input[type="checkbox"]').each(function () {
    var checkbox_this = $(this);
    if (checkbox_this.is(':checked') == true) {
      checkbox_this.attr('value', '1');
    } else {
      checkbox_this.prop('checked', true);
      checkbox_this.attr('value', '0');
    }
  });
});
