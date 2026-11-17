package com.example.uidlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.uidlab.authScreen.AuthScreen
import com.example.uidlab.authScreen.AuthViewModel
import com.example.uidlab.ui.theme.UIDlABTheme
import com.example.uidlab.ui.theme.UIDlABTheme


class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            UIDlABTheme() {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->

                    val viewModel = viewModel<AuthViewModel>()

                    AuthScreen(
                        viewModel = viewModel
                    )
                }
            }
        }
















    }
}

