var chatOpened = false;
var chatAnimationsInProgress = false;

$(document).ready(function(){
  // INITIAL VISUAL SETTINGS
  $("#chat-loading").hide();
  $("#chat-messages").hide();

  // add "click" handler for the chat button & header
  $('#chat-header').on("click", chatToggle);
  // attach a handler to the login form, for the "subit" event
  $('#form-login').on("submit", loginFormSubmit);
})


function loginFormSubmit( event ) {
    // make sure the form is not submitted and the page refreshed
    event.preventDefault();
    // get a reference to the form as a jQuery Object
    var $this = $(this);
    // FAKE CREDENTIALS CHECK ON SERVER SIDE
    // disable controls
    $this.children("input").attr("disabled", true);
    // display Processing ... animation for 2 seconds
    $("#chat-loading").show().delay(3000).queue(function() {
      loginVerifyCredentials();
      $(this).hide();
      $(this).dequeue();
    });
}

function loginVerifyCredentials() {
  // get a referenc to the login form
  $loginForm = $("#form-login");
  // read the values from the fields
  var username = $loginForm.children("#username").val();
  var password = $loginForm.children("#password").val();
  // compare values with "local database"
  if(username == "admin" && password == "admin1234") {
    loginDisplayMessage("Authentication successfull !", false);
  } else {
    // re-enable form-controls to allow a new login attempt
    $loginForm.children("input").attr("disabled", false);
    // credentials are incorrect
    loginDisplayMessage("Invalid username or password", true);
  }
}

function loginDisplayMessage(message, error) {
  // get a reference to the container in which we will display the message
  var $container = $("#form-login p");
  // setup the message icon and format according to the action result
  var iconCode = "";
  if (error == true) {
    // display an error messge
    $container.removeClass("success").addClass("warning");
    iconCode = '<i class="fa fa-warning"></i>';
  } else {
    // display a success message
    $container.removeClass("warning").addClass("success");
    iconCode = '<i class="fa fa-check"></i>';
  }
  // display the message
  $container.html(iconCode + " " + message);
}

function chatToggle() {
  // check if there are any running animations
  if(chatAnimationsInProgress) {
    return;
  }
  // we will start an animation: make sure the user cannot launch others
  // on the Chat component
  chatAnimationsInProgress = true;

  if(chatOpened == false) {
    chatShow();
  } else {
    chatHide();
  }
}

function chatShow() {
  // start the animation of chat opening by extending the main container
  // to the full display extent
  $('#chat-div').animate({ width: "300px", height: "300px" }, 500, function() {
    // add the text now, when there is enough space to display it
    $('#chat-header span').text("Chat with us !");
    // create the X element and add it to the DOM
    $("<i>").addClass("fa fa-times").appendTo($('#chat-header'));
    // display the body of the chat, by animating it vertically
    $('#chat-body').animate({ height: "300px" }, 500, function() {
      // set the flag indicating the current state of the chat control
      chatOpened = true;
      // enable other animations on the chat control
      chatAnimationsInProgress = false;
    });
  });
}

function chatHide() {
  // hide the body of the chat through the vertical animation
  $('#chat-body').animate({ height: "0px" }, 500, function () {
    // remove the text of the header and the X mark
    $('#chat-header span').text("");
    $('#chat-header').children(".fa-times").remove();
    // hide the header throught horizontal animation
    $('#chat-div').animate({ width: "40px", height: "40px" }, 500, function() {
      // set the flag indicating the current state of the chat control
      chatOpened = false;
      // enable other animations on the chat control
      chatAnimationsInProgress = false;
    });
  });
}
