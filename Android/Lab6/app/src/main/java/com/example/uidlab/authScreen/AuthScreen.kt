package com.example.uidlab.authScreen

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel


@Composable
fun AuthScreen(
    viewModel: AuthViewModel
) {

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(25.dp)
    ) {
        Text(
            text = "Username",
            fontSize = 30.sp
        )

        TextField(
            value = viewModel.username,
            onValueChange = { newUsername ->
                viewModel.updateUsername(newUsername)
            },
            supportingText = {
                Text(
                    text = viewModel.usernameError
                )
            },
            isError = viewModel.usernameError.isNotEmpty()
        )

        // Sau asa:

//        if(viewModel.usernameError.isNotEmpty()) {
//            Text(
//                text = viewModel.usernameError,
//                color = Color.Red
//            )
//        }

        Spacer(Modifier.height(30.dp))

        Text(
            text = "Password",
            fontSize = 30.sp
        )

        TextField(
            value = viewModel.password,
            onValueChange = { newPassword ->
                viewModel.updatePassword(newPassword)
            },
            supportingText = {
                Text(
                    text = viewModel.passwordError
                )
            },
            visualTransformation = PasswordVisualTransformation(),
            isError = viewModel.passwordError.isNotEmpty()
        )

        Button(
            onClick = {
                viewModel.signIn()
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 50.dp),
            shape = RectangleShape,
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.LightGray,
                contentColor = Color.Black
            )
        ) {
            Text(
                text = "Sign In"
            )
        }
        if(viewModel.signInError.isNotEmpty()) {
            Text(
                text = viewModel.signInError,
                color = Color.Red,
                textAlign = TextAlign.Center
            )
        }

        if(viewModel.signInSuccessful.isNotEmpty()) {
            Text(
                text = viewModel.signInSuccessful,
                color = Color.Green,
                textAlign = TextAlign.Center
            )
        }

    }
}

@Preview(showBackground = true)
@Composable
private fun AuthScreenPreview() {
    //AuthScreen()
}

















