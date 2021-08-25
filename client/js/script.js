jQuery(document).ready(function($) {
    var curStep = 1;

    $('#hidePass').on('click', function() {
        if( $('#password').attr('type') == 'text' )
            $('#password').attr('type', 'password');
        else
            $('#password').attr('type', 'text');
    });

    $('.advertise .prev-btn').on('click', function() {
        curStep --;
        if( curStep == 1 )
            $(this).hide();
        
        $('.advertise p').hide();
        $('.advertise').find('#step'+curStep).show();
    });

    $('.advertise .next-btn').on('click', function() {
        curStep ++;
        $('.advertise p').hide();
        if( curStep < 4 ) {
            $('.advertise .prev-btn').css('display', 'flex');
            $('.advertise').find('#step'+curStep).show();
        } else {
            $('.advertise .prev-btn').hide();
            $(this).attr('href', 'streamlist.html');
        }
    });

    $('.buynow-btn').on('click', function() {
        $('#buyModal').fadeIn('slow');
        $('body').addClass('overflow-hidden');
    });

    $('.backbone').on('click', function() {
        $('body').removeClass('overflow-hidden');
        $('#buyModal').fadeOut();
    });
});