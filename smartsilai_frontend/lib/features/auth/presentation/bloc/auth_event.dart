import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();
  @override
  List<Object?> get props => [];
}

// Handles Login for both Tailor and Customer
class LoginSubmitted extends AuthEvent {
  final String phoneNumber;
  final String? password; // Optional because Customers don't have passwords in your DB!
  final String role; // 'Tailor' or 'Customer'

  const LoginSubmitted({
    required this.phoneNumber,
    this.password,
    required this.role,
  });

  @override
  List<Object?> get props => [phoneNumber, password, role];
}

// Tailor Registration - matching your exact DB columns from pgAdmin
class TailorRegisterSubmitted extends AuthEvent {
  final String fullName;
  final String phoneNumber;
  final String shopName;
  final String specialization;
  final String bio;
  final String shopAddress;
  final String shopType;
  final String password;

  const TailorRegisterSubmitted({
    required this.fullName,
    required this.phoneNumber,
    required this.shopName,
    required this.specialization,
    required this.bio,
    required this.shopAddress,
    required this.shopType,
    required this.password,
  });

  @override
  List<Object?> get props => [
        fullName,
        phoneNumber,
        shopName,
        specialization,
        bio,
        shopAddress,
        shopType,
        password,
      ];
}

class LogoutRequested extends AuthEvent {}