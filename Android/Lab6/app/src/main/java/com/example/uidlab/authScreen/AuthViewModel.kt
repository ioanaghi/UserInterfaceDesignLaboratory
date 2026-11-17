package com.example.uidlab.authScreen

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

class AuthViewModel: ViewModel() {

    var username by mutableStateOf("")
        private set

    var usernameError by mutableStateOf("")
        private set

    var password by mutableStateOf("")
        private set

    var passwordError by mutableStateOf("")
        private set

    var signInError by mutableStateOf("")
        private set
    var signInSuccessful by mutableStateOf("")
        private set

    fun updateUsername(value: String) {
        username = value
    }

    fun updatePassword(value: String) {
        password = value
    }

    fun signIn() {

        usernameError = when {
            username.isBlank() -> "Username cannot be empty!"
            username.length < 3 -> "Username is too short!"
            else -> ""
        }


        passwordError = when {
            password.isBlank() -> "Password cannot be empty!"
            password.length < 6 -> "Password is too short!"
            else -> ""
        }


        signInError = when {
            username!="admin" && username.length>=3 ->"Login failed username or password are incorrect"
            password!="password" && password.length>=6->"Login failed username or password are incorrect"
            else ->""
        }

        signInSuccessful = when {
            username=="admin" && password== "password" ->"Login successfull!"
            else -> ""
        }


    }
}






















