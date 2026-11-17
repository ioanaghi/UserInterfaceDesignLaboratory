// Lab 5 AJAX behavior; previous laboratory scripts remain unchanged.
$(function () {
    "use strict";
    const api = "http://193.226.5.99/chat-piu/";
    const $toggle = $("#chat-toggle"), $panel = $("#chat-panel");
    const $auth = $("#chat-auth-form"), $credentials = $("#chat-credentials");
    const $conversation = $("#chat-conversation"), $messages = $("#chat-messages");
    const $status = $("#chat-auth-message"), $statusText = $("#chat-auth-message-text");
    const $input = $("#chat-new-message");
    let token = null, open = false, animating = false, busy = false, pollTimer = null;

    function message(text, success) {
        if (token && !$conversation.prop("hidden")) {
            $("#chat-session-message").text(text).prop("hidden", false);
            return;
        }
        $status.prop("hidden", false).toggleClass("success", !!success);
        $statusText.text(text);
    }
    function error(xhr) {
        if (xhr.responseJSON && xhr.responseJSON.message) return xhr.responseJSON.message;
        try { return JSON.parse(xhr.responseText).message || "Request failed."; }
        catch (_) { return xhr.status ? "Request failed (" + xhr.status + ")." : "Could not reach the chat server."; }
    }
    function request(path, method, data) {
        return $.ajax({
            url: api + path, method: method,
            contentType: "application/json", dataType: "json",
            data: data === undefined ? undefined : JSON.stringify(data),
            beforeSend: function (xhr) { xhr.setRequestHeader("Authorization", "Bearer " + token); }
        });
    }
    function stopPoll() { clearTimeout(pollTimer); pollTimer = null; }
    function schedulePoll() {
        stopPoll();
        if (token) pollTimer = setTimeout(readMessages, 3000);
    }
    function endSession(text) {
        stopPoll(); token = null;
        $conversation.prop("hidden", true);
        $auth.prop("hidden", false)[0].reset();
        $credentials.find("input, button").prop("disabled", false);
        $messages.empty();
        $("#chat-session-message").prop("hidden", true);
        if (text) message(text, false); else $status.prop("hidden", true);
    }
    function readMessages() {
        if (!token) return;
        if (busy) { schedulePoll(); return; }
        busy = true;
        request("readmessages.php", "GET")
            .done(function (data) {
                $messages.empty();
                (Array.isArray(data.messages) ? data.messages : []).forEach(function (item) {
                    const $bubble = $("<p>").addClass("chat-bubble");
                    $("<strong>").text(item.sender || "Unknown").appendTo($bubble);
                    $("<span>").text(" " + (item.text || "")).appendTo($bubble);
                    if (item.timestamp) $("<time>").text(" · " + item.timestamp).appendTo($bubble);
                    $messages.append($bubble);
                });
                $messages.scrollTop($messages[0].scrollHeight);
            })
            .fail(function (xhr) {
                if (xhr.status === 401) endSession("Session expired. Please authenticate again.");
                else message(error(xhr), false);
            })
            .always(function () { busy = false; schedulePoll(); });
    }

    $toggle.on("click", function () {
        if (animating) return;
        animating = true;
        if (!open) {
            open = true;
            $panel.addClass("is-visible").attr("aria-hidden", "false").prop("inert", false);
            $toggle.attr({ "aria-expanded": "true", "aria-label": "Close chat" });
            $("#chat-open-icon").prop("hidden", true);
            $("#chat-close-icon").prop("hidden", false);
            $toggle.addClass("expanded");
            setTimeout(function () {
                $panel.addClass("stage-two");
                setTimeout(function () {
                    $panel.addClass("ready");
                    (token ? $input : $("#chat-username")).trigger("focus");
                    animating = false;
                }, 500);
            }, 500);
        } else {
            open = false;
            $panel.prop("inert", true).attr("aria-hidden", "true").removeClass("ready stage-two");
            $toggle.attr({ "aria-expanded": "false", "aria-label": "Open chat" }).trigger("focus");
            setTimeout(function () {
                $panel.removeClass("is-visible");
                $toggle.removeClass("expanded");
                setTimeout(function () {
                    $("#chat-open-icon").prop("hidden", false);
                    $("#chat-close-icon").prop("hidden", true);
                    animating = false;
                }, 500);
            }, 500);
        }
    });
    $panel.on("keydown", function (event) {
        if (event.key === "Escape" && open && !animating) $toggle.trigger("click");
    });

    $auth.on("submit", function (event) {
        event.preventDefault();
        const username = $("#chat-username").val().trim();
        const password = $("#chat-password").val();
        if (!username || !password) { message("Enter your username and password.", false); return; }
        $credentials.find("input, button").prop("disabled", true);
        $auth.attr("aria-busy", "true");
        $("#chat-spinner").prop("hidden", false);
        message("Processing ...", false);
        $.ajax({
            url: api + "authenticate.php", method: "POST",
            contentType: "application/json", dataType: "json",
            data: JSON.stringify({ username: username, password: password })
        }).done(function (data) {
            if (!data.token) { message("The server did not return a session token.", false); return; }
            token = data.token;
            $("#chat-display-name").text(data.display || username);
            $status.prop("hidden", true);
            $auth.prop("hidden", true);
            $conversation.prop("hidden", false);
            $("#chat-session-message").prop("hidden", true);
            $input.trigger("focus");
            readMessages();
        }).fail(function (xhr) {
            message(error(xhr), false);
        }).always(function () {
            $("#chat-spinner").prop("hidden", true);
            $auth.attr("aria-busy", "false");
            if (!token) $credentials.find("input, button").prop("disabled", false);
        });
    });

    $("#chat-send-form").on("submit", function (event) {
        event.preventDefault();
        const value = $input.val().trim();
        if (!token || !value || busy) return;
        busy = true; stopPoll();
        $(this).find("input, button").prop("disabled", true);
        request("sendmessage.php", "PUT", { message: value })
            .done(function () { $input.val(""); })
            .fail(function (xhr) {
                if (xhr.status === 401) endSession("Session expired. Please authenticate again.");
                else message(error(xhr), false);
            })
            .always(function () {
                busy = false;
                $("#chat-send-form").find("input, button").prop("disabled", false);
                if (token) readMessages();
            });
    });
    $("#chat-logout").on("click", function () {
        if (!token || busy) return;
        busy = true; stopPoll();
        request("logout.php", "DELETE")
            .done(function () { endSession(); })
            .fail(function (xhr) { message(error(xhr), false); })
            .always(function () { busy = false; schedulePoll(); });
    });
});
