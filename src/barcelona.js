$(document).ready(function() {
  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
  var handler = StripeCheckout.configure({
    key: 'pk_test_wcUulyjGHdAKQTC8qMYxCMFR',
    image: 'http://barcelonajs.org/assets/img/bcnjs.png',
    locale: 'auto',
    token: function(token) {
      postJob(this, token);
    }
  });
  var postJob = function postJob(source, token) {
    tinyMCE.triggerSave();

    var formData = $('#jobsForm').serialize();
    formData += '&tier=' + $(source).attr('id');

    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization',
            'Bearer ' + localStorage.getItem('userToken'));
        }
        if (token) {
          xhr.setRequestHeader('X-Stripe-Token', JSON.stringify(token));
        }
      }
    });

    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5133/jobs',
      data: formData,
      success: function() {},
      contentType: 'application/x-www-form-urlencoded'
    }, function(error, res) {
      console.log(error, res);
    });
  };

  var userProfile = null;
  
  if ($('#ge-btn-login').length > 0) {
    $('#ge-btn-login').on('click', function() {
      lock.show({
        authParams: {
          scope: 'openid identities'
        }
      }, function(err, profile, token) {
        if (err) {
          // Error callback
          console.error('Something went wrong: ', err);
          alert('Something went wrong, check the Console errors');
        } else {
          // Success calback

          // Save the JWT token.
          localStorage.setItem('userToken', token);

          // Save the profile
          userProfile = profile;

          document.getElementById('login-box').style.display = 'none';
          document.getElementById('logged-in-box').style.display = 'inline';

          document.getElementById('nick').textContent = profile.nickname;
        }
      });
    });
  }

  $('#jobs-submit-free').on('click', function(e) {
    e.preventDefault();
    postJob(this);
  });

  $('#jobs-submit-premium').on('click', function(e) {
    handler.open({
      name: 'BarcelonaJS',
      description: 'BarcelonaJS Premium Job Listing',
      currency: 'eur',
      billingAddress: true,
      email: $('#email').val(),
      allowRememberMe: false,
      zipCode: true,
      amount: 4900
    });
    e.preventDefault();
  });

  $('#jobs-submit-platinum').on('click', function(e) {
    handler.open({
      name: 'BarcelonaJS',
      description: 'BarcelonaJS Platinum Job Listing',
      currency: 'eur',
      billingAddress: true,
      email: $('#email').val(),
      allowRememberMe: false,
      zipCode: true,
      amount: 9900
    });
    e.preventDefault();
  });
  // Close Checkout on page navigation
  $(window).on('popstate', function() {
    handler.close();
  });

  $('#talk-submit-button').on('click', function(e) {
    var $form = $('#talk-submit-form');
    var title = $form.find('input[name="title"]').val();
    var language = $form.find('select[name="language"]').val();
    var target = $form.find('select[name="target"]').val();
    var twitter = $form.find('input[name="twitter"]').val();
    var description = $form.find('textarea[name="description"]').val();
    var createIssueLink = 'https://github.com/BarcelonaJS/speakers/issues/new?title='
      + title + '&body=---%0Alevel:%20'
      + target + '%0Alanguage:%20'
      + language + '%0Atwitter:%20'
      + twitter + '%0Atags:%0A%20%20-%20hello%0A%20%20-%20node%0A---%0A%0A'
      + description;
    window.location.href = createIssueLink;
  });
});
