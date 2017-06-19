$(document).on('click','#submit2', function(e){
    var text_ori2 = $('#message_ori2').val();
    var date2     = $('#date_open2').val();
    var to2       = $('#message_to2').val();
    var from2     = $('#message_from2').val();

    var key2      = from2+to2+date2+'TA2017';
    //var key2      = '123456789012345';
    
    var sortAlphabets = function(stringConcat) {
        return stringConcat.split('').sort().join('');
    };
    
    key2  = sortAlphabets(key2);
    console.log('KEY >>>> ' + key2);

    text_ori2   = window.encrypt(text_ori2, key2);
    $('#message_c2').val(text_ori2);
    
    //Bawah buat submit
    $('#submitFormBtn2').click();
});