import 'package:flutter_bloc/flutter_bloc.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(AuthInitial()) {
    on<LoginSubmitted>(_onLoginSubmitted);
    on<TailorRegisterSubmitted>(_onTailorRegister);
    on<LogoutRequested>(_onLogoutRequested);
  }

  void _onLoginSubmitted(LoginSubmitted event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    await Future.delayed(const Duration(milliseconds: 800)); // Network simulation

    if (event.role == 'Customer') {
      // Customers login via phone number cleanly
      emit(AuthAuthenticated(
        currentUserName: "Vaidehi Darji", 
        role: "Customer",
        sessionData: {
          "phone_number": event.phoneNumber,
        },
      ));
    } else {
      // --- TAILOR REGISTRATION CHECK SIMULATION ---
      // For testing, let's pretend only this specific phone number is registered in your database
      const String registeredTailorPhone = "9876543210"; 

      if (event.phoneNumber == registeredTailorPhone) {
        emit(AuthAuthenticated(
          currentUserName: "Anjali Sharma",
          role: "Tailor",
          sessionData: {
            "phone_number": event.phoneNumber,
            "shop_name": "StitchCraft Studio",
            "specialization": "Blouse Designer, Kurtis",
            "bio": "Bringing your design ideas to life 🧵✨",
            "shop_address": "402 Creative Plaza, Mumbai",
            "rating": 4.8,
            "follower_count": 1250,
            "shop_type": "Boutique"
          },
        ));
      } else {
        // If the number doesn't match our simulated registered phone, block login completely!
        emit(const AuthFailure(
          errorMessage: "This Tailor profile is not registered. Please sign up first!",
        ));
      }
    }
  }

  void _onTailorRegister(TailorRegisterSubmitted event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    await Future.delayed(const Duration(seconds: 1)); // Simulating INSERT INTO database

    // After registration, they are officially saved, so we let them right into the dashboard
    emit(AuthAuthenticated(
      currentUserName: event.fullName,
      role: "Tailor",
      sessionData: {
        "phone_number": event.phoneNumber,
        "shop_name": event.shopName,
        "specialization": event.specialization,
        "bio": event.bio,
        "shop_address": event.shopAddress,
        "shop_type": event.shopType,
        "rating": 0.0,
        "follower_count": 0
      },
    ));
  }

  void _onLogoutRequested(LogoutRequested event, Emitter<AuthState> emit) {
    emit(AuthInitial());
  }
}