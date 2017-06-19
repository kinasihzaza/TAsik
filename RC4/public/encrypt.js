$(document).on('click','#submit', function(e){
    var text_ori = $('#message_ori').val();
    var date     = $('#date_open').val();
    var to       = $('#message_to').val();
    var from     = $('#message_from').val();

    var key      = from+to+date+'TA2017';
    
    var sortAlphabets = function(stringConcat) {
        return stringConcat.split('').sort().join('');
    };
    
    key  = sortAlphabets(key);
    console.log(key);

    text_ori   = window.encrypt(text_ori, key);
    $('#message_c').val(text_ori);
    
    //Bawah buat submit
    $('#submitFormBtn').click();
});