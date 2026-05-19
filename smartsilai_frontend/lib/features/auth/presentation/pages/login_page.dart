import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; 
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _shopNameController = TextEditingController();
  final _specializationController = TextEditingController();
  final _bioController = TextEditingController();
  final _addressController = TextEditingController();

  String _selectedRole = 'Tailor';
  String _selectedShopType = 'Boutique';
  bool _isRegisterMode = false;
  int _tailorRegistrationStep = 1; 

  final List<String> _roles = ['Tailor', 'Customer'];
  final List<String> _shopTypes = ['Boutique', 'Home Tailor', 'Commercial Factory'];

  void _showUnregisteredDialog(String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Color(0xFFF95738), size: 28),
              SizedBox(width: 8),
              Text('Profile Not Found', style: TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context); 
                setState(() {
                  _isRegisterMode = true; 
                  _tailorRegistrationStep = 1;
                });
              },
              child: const Text('Register First'),
            ),
          ],
        );
      },
    );
  }

  void _submitAuthForm() {
    if (!_formKey.currentState!.validate()) return;

    final phone = _phoneController.text.trim();
    final password = _passwordController.text.trim();

    if (_isRegisterMode && _selectedRole == 'Tailor' && _tailorRegistrationStep == 1) {
      setState(() { _tailorRegistrationStep = 2; });
      return;
    }

    if (_isRegisterMode && _selectedRole == 'Tailor' && _tailorRegistrationStep == 2) {
      BlocProvider.of<AuthBloc>(context).add(
        TailorRegisterSubmitted(
          fullName: _fullNameController.text.trim(),
          phoneNumber: phone,
          shopName: _shopNameController.text.trim(),
          specialization: _specializationController.text.trim(),
          bio: _bioController.text.trim(),
          shopAddress: _addressController.text.trim(),
          shopType: _selectedShopType,
          password: password,
        ),
      );
    } else {
      BlocProvider.of<AuthBloc>(context).add(
        LoginSubmitted(
          phoneNumber: phone,
          password: _selectedRole == 'Tailor' ? password : null,
          role: _selectedRole,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthFailure) {
            _showUnregisteredDialog(state.errorMessage);
          }
        },
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 400),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Text('SmartSilai', textAlign: TextAlign.center, style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFF0D3B66))),
                        const SizedBox(height: 24),

                        if (_tailorRegistrationStep == 1) ...[
                          DropdownButtonFormField<String>(
                            value: _selectedRole,
                            decoration: const InputDecoration(labelText: 'Portal Role', prefixIcon: Icon(Icons.person_pin_rounded)),
                            items: _roles.map((role) => DropdownMenuItem(value: role, child: Text(role))).toList(),
                            onChanged: (value) {
                              setState(() { 
                                _selectedRole = value!;
                                if (_selectedRole == 'Customer') _isRegisterMode = false;
                              });
                            },
                          ),
                          const SizedBox(height: 16),

                          TextFormField(
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                            inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(10)],
                            decoration: const InputDecoration(labelText: '10-Digit Phone Number', prefixIcon: Icon(Icons.phone)),
                            validator: (value) => (value == null || value.trim().length != 10) ? 'Must be exactly 10 digits' : null,
                          ),
                          const SizedBox(height: 16),

                          if (_selectedRole == 'Tailor') ...[
                            TextFormField(
                              controller: _passwordController,
                              obscureText: true,
                              decoration: const InputDecoration(labelText: 'Password', prefixIcon: Icon(Icons.lock_outline)),
                              validator: (value) => (value == null || value.trim().isEmpty) ? 'Password required' : null,
                            ),
                            const SizedBox(height: 16),
                          ],
                        ] else ...[
                          TextFormField(controller: _fullNameController, decoration: const InputDecoration(labelText: 'Your Full Name')),
                          const SizedBox(height: 12),
                          TextFormField(controller: _shopNameController, decoration: const InputDecoration(labelText: 'Shop Name')),
                          const SizedBox(height: 12),
                          TextFormField(controller: _specializationController, decoration: const InputDecoration(labelText: 'Specializations')),
                          const SizedBox(height: 12),
                          TextFormField(controller: _bioController, decoration: const InputDecoration(labelText: 'Shop Bio')),
                          const SizedBox(height: 12),
                          TextFormField(controller: _addressController, decoration: const InputDecoration(labelText: 'Workshop Address')),
                          const SizedBox(height: 12),
                        ],
                        const SizedBox(height: 24),

                        ElevatedButton(
                          onPressed: _submitAuthForm,
                          child: Text(_isRegisterMode && _tailorRegistrationStep == 1 ? 'Next: Complete Profile' : _isRegisterMode ? 'Register Studio' : 'Login Securely'),
                        ),
                        const SizedBox(height: 16),

                        if (_selectedRole == 'Tailor' && _tailorRegistrationStep == 1)
                          TextButton(
                            onPressed: () { setState(() { _isRegisterMode = !_isRegisterMode; }); },
                            child: Text(_isRegisterMode ? 'Have an account? Sign In' : 'New Tailor? Register Here'),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}