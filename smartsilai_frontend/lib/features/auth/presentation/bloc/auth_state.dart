import 'package:equatable/equatable.dart';

abstract class AuthState extends Equatable {
  const AuthState();
  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}

class AuthAuthenticated extends AuthState {
  final String currentUserName; // Stores 'full_name' from either table
  final String role;
  final Map<String, dynamic> sessionData; // Holds profile details (shop_name, bio, etc.)

  const AuthAuthenticated({
    required this.currentUserName,
    required this.role,
    required this.sessionData,
  });

  @override
  List<Object?> get props => [currentUserName, role, sessionData];
}

class AuthFailure extends AuthState {
  final String errorMessage;
  const AuthFailure({required this.errorMessage});

  @override
  List<Object?> get props => [errorMessage];
}