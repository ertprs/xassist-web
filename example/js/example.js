let jsxc = new JSXC({
   loadConnectionOptions: (username, password) => {
      return Promise.resolve({
         xmpp: {
            url: 'https://im.focuzar.com/bosh',
            domain: 'im.focuzar.com',
         }
      });
   },
   connectionCallback: (jid, status) => {
      const CONNECTED = 5;
      const ATTACHED = 8;

      if (status === CONNECTED || status === ATTACHED) {
         $('.logout').show();
         $('.submit').hide();
         $('body').addClass('jsxc-fullscreen jsxc-two-columns')
      } else {
         $('.logout').hide();
         $('.submit').show();
         $('body').removeClass('jsxc-fullscreen jsxc-two-columns')
      }
   }
});

subscribeToInstantLogin();
watchForm();
watchLogoutButton();

function watchForm() {
   let formElement = $('#watch-form');
   let usernameElement = $('#watch-username');
   let passwordElement = $('#watch-password');
   jsxc.watchForm(formElement, usernameElement, passwordElement);
}

function watchLogoutButton() {
   let buttonElements = $('.logout');

   jsxc.watchLogoutClick(buttonElements);
}

function subscribeToInstantLogin() {
   $('#instant-login-form').submit(function(ev) {
      var url = 'https://im.focuzar.com/bosh';
      var domain = 'im.focuzar.com';

      var username = $(this).find('[name="username"]').val();
      var password = $(this).find('[name="password"]').val();

      var jid = username + '@' + domain;

      jsxc.start(url, jid, password)
         .then(function() {
            console.log('>>> CONNECTION READY');
            console.log('loged in ');
            
         }).catch(function(err) {
            console.log('>>> catch', err)
         })

      return false;
   });
}
function getEmail() {
   var url = "https://imapi.focuzar.com/index.php";
   var email = $('#watch-username').val();
   // var password = $('#watch-password').val();
   $('.login-button-btn').attr('disabled', true);
   if(email) {
      $.ajax({
         url:'https://imapi.focuzar.com/index.php',
         data: {"task": 'webgetvcode', email : email},
         complete: function (response) {
            console.log(response);
            let jsonResponse = JSON.parse(response.responseText);
            if(jsonResponse && jsonResponse.response) {
               document.getElementById('watch-username').value= jsonResponse.response + "@im.focuzar.com";   
               // document.getElementById('watch-password').value= password;   
               // watchForm();
               // $('#watch-form').submit();
               $('.login-button-btn').attr('disabled', false);
               return false;
            }
         },
         error: function () {
            console.log(error);
         },
     });
   }
}

$('.signup-link').click(function() {
   $('.signup-section').show();
   $('.login-section').hide();
   $('.resetpassword-section').hide();
});

$('.forgot-password').click(function() {
   $('.signup-section').hide();
   $('.login-section').hide();
   $('.resetpassword-section').show();
});

$('.bcklogin').click(function() {
   $('.signup-section').hide();
   $('.login-section').show();
   $('.resetpassword-section').hide();
})


$('#signup-form').submit(function() {
   var url = 'https://imapi.focuzar.com/index.php';
   var isFormValid = validateInput('signup-section');
   if (!isFormValid) { 
      return false;
   } else {
      var emailValue = $('#signup_email').val();
      isFormValid = ValidateEmail(emailValue, 'signup-email-error'); 
      if(isFormValid) {
         $('#signup-section-email-error').text('');
         var password = $('#signup_password').val();
         var cpassword = $('#signup_cpassword').val();
         var user = new Date().getMilliseconds();
         $('#user_vcode').val(user);
         isFormValid = confirmPasswordValidation(password, cpassword, 'signup-cpassword-error');
         if(isFormValid) {
            $('#signup-section-cpassword-error').text('');
            var data  = $( "#signup-form" ).serialize();
            $.post(url, data).done(function( response ) {
               console.log(response);
            });
            return true;
         } else {
            $('#signup-section-cpassword-error').text('Password miss matched');
            return false;
         }
      } else {
         $('#signup-section-email-error').text('Email Format is Wrong');
         return false;
      }
   }
});

$('#reset-form').submit(function() {
   var url ='https://imapi.focuzar.com/index.php';
   var isFormValid = validateInput('resetpassword-section');
   if (!isFormValid) { 
      return false;
   } else {
      var emailValue = $('#resetpassword_email').val();
      isFormValid = ValidateEmail(emailValue, 'reset_email_error'); 
      if(isFormValid) {
         $('#resetpassword-section-email-error').text('');
         var password = $('#reset_password').val();
         var cpassword = $('#reset_cpassword').val();
         isFormValid = confirmPasswordValidation(password, cpassword, 'reset_cpassword_error');
         if(isFormValid) {
            $('#resetpassword-section-cpassword-error').text('');
            var data  = $( "#reset-form" ).serialize();
            $.post(url, data).done(function( response ) {
               console.log(response);
               if(response.response == 'Success') {
                  window.location.reload();
               } else {
                  $('#resetpassword-error').text(response.response);
               }
               return true;
            });
            return false;
            
         } else {
            $('#resetpassword-section-cpassword-error').text('Password miss matched');
            return false;
         }
      } else {
         $('#resetpassword-section-email-error').text('Invalid Email Address');
         return false;
      }
   }
});

function getOTP(section) {
   var url = 'https://imapi.focuzar.com/index.php';
   var email = $('#'+section+'_email').val();
   $('.'+section+'_otp_section').hide();
   if ($.trim(email).length > 0){
      var isValid = ValidateEmail(email, section+'_email_error');
      if(isValid) {
         $('#'+section+'-section-email-error').text('');
         $.post(url, { email: email, task: 'sendotp' }).done(function( response ) {
            console.log(response);
            $('#'+section+'_otp_section').show();
         });
      } else {
         $('#'+section+'-section-email-error').text('Invalid Email Address');
      }
   }
}

function validateInput(section) {
   var isFormValid = true;
   var letters = /^[A-Za-z]+$/;
   $("."+ section + " input").each(function(){
      var errorId = $(this).data('section');
      var inputVal = $.trim($(this).val());
      if (inputVal.length == 0){
         $(this).addClass("highlight");
         if(errorId == 'username') {
            $('#'+section+'-'+errorId+'-error').text('Please Enter Valid Username');
         } else if(errorId=='email') {
            $('#'+section+'-'+errorId+'-error').text('Please Enter Valid Email');
         } else if(errorId=='password') {
            $('#'+section+'-'+errorId+'-error').text('Please Enter Valid Password');
         } else if(errorId=='cpassword') {
            $('#'+section+'-'+errorId+'-error').text('Please Enter Valid Password');
         } else if(errorId=='otp') {
            $('#'+section+'-'+errorId+'-error').text('Please Enter Valid OTP');
         } else {
            $('#'+section+'-'+errorId+'-error').text('please enter value');
         }
         isFormValid = false;
      } else if(errorId == 'username' && !inputVal.match(letters)) {
         $('#'+section+'-'+errorId+'-error').text('Username Only Accepts Alphabets');
         isFormValid = false;
      }
      else{
         $(this).removeClass("highlight");
         $('#'+section+'-'+errorId+'-error').text('');
      }
  });
  return isFormValid;
}

function ValidateEmail(inputText, elementClass)
{
   var mailformat = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
   if(inputText.match(mailformat))
   {
      $('.'+elementClass).hide();
      $('.'+elementClass).text('');
      return true;
   }
   else
   {
      $('.'+elementClass).show();
      $('.'+elementClass).text('Invalid Email Address');
      return false;
   }
}

function confirmPasswordValidation(inputText, CinputText, elementClass)
{
   if(inputText === CinputText)
   {
      $('.'+elementClass).hide();
      $('.'+elementClass).text('');
      return true;
   }
   else
   {
      $('.'+elementClass).show();
      $('.'+elementClass).text('Password and Confirm password are not same');
      return false;
   }
}
