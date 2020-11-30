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
   var isFormValid = validateInput('signup-section');
   if (!isFormValid) { 
      return false;
   } else {
      var emailValue = $('#signup_email').val();
      isFormValid = ValidateEmail(emailValue, 'signup-email-error'); 
      if(isFormValid) {
         var password = $('#signup_password').val();
         var cpassword = $('#signup_cpassword').val();
         isFormValid = confirmPasswordValidation(password, cpassword, 'signup-cpassword-error');
         if(isFormValid) {
            return true;
         } else {
            return false;
         }
      } else {
         return false;
      }
   }
});

$('#reset-form').submit(function() {
   var isFormValid = validateInput('resetpassword-section');
   if (!isFormValid) { 
      return false;
   } else {
      var emailValue = $('#reset_email').val();
      isFormValid = ValidateEmail(emailValue, 'reset_email_error'); 
      if(isFormValid) {
         var password = $('#reset_password').val();
         var cpassword = $('#reset_cpassword').val();
         isFormValid = confirmPasswordValidation(password, cpassword, 'reset_cpassword_error');
         if(isFormValid) {
            return true;
         } else {
            return false;
         }
      } else {
         return false;
      }
   }
});


function validateInput(section) {
   var isFormValid = true;
   $("."+ section + " input").each(function(){
      if ($.trim($(this).val()).length == 0){
         $(this).addClass("highlight");
         isFormValid = false;
      }
      else{
         $(this).removeClass("highlight");
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
      return true;
   }
   else
   {
      $('.'+elementClass).show();
      $('.'+elementClass).text('Password and Confirm password are not same');
      return false;
   }
}
