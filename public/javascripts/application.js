// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function submitFileForm(fileName, fileSize, contentType) {
  $('#file_file_name_input').val(fileName);
  $('#file_file_size_input').val(fileSize);
  $('#file_content_type').val('application/' + contentType.replace('.', ''));
  $.post($('#upload_form').attr('action') + '?container=attachments_list',
    $('#upload_form').serialize(),
    function(data){
      eval(data);
    });
}

