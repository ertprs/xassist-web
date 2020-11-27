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
});
