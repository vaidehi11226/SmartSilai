import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/auth/presentation/bloc/auth_state.dart';
import 'features/auth/presentation/bloc/auth_event.dart'; // REQUIRED: Resolves LogoutRequested
import 'features/auth/presentation/pages/login_page.dart';

// --- RESPONSIVE & FLEXIBLE INLINE DASHBOARDS ---

class CustomerDashboard extends StatelessWidget {
  final String name;
  const CustomerDashboard({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Hello, $name 👋', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0D3B66),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () => BlocProvider.of<AuthBloc>(context).add(LogoutRequested()), 
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // FIXED: The 'style' attribute is now attached correctly inside the Text widget, not Padding
            const Padding(
              padding: EdgeInsets.only(bottom: 12),
              child: Text(
                "Trending Designs",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0D3B66)),
              ),
            ),
            ...List.generate(2, (index) {
              return Card(
                margin: const EdgeInsets.only(bottom: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      leading: const CircleAvatar(
                        backgroundColor: Color(0xFF0D3B66),
                        child: Icon(Icons.storefront, color: Colors.white),
                      ),
                      title: Text(index == 0 ? 'StitchCraft Studio' : 'Royal Tailors', style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(index == 0 ? '⭐ 4.8 Rating' : '⭐ 4.5 Rating'),
                      trailing: SizedBox(
                        height: 36,
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF95738)),
                          child: const Text('Book'),
                        ),
                      ),
                    ),
                    AspectRatio(
                      aspectRatio: 16 / 10,
                      child: Container(
                        color: Colors.grey[300],
                        child: const Center(child: Icon(Icons.image, size: 40, color: Colors.grey)),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}

class TailorDashboard extends StatelessWidget {
  final String shopName;
  final Map<String, dynamic> stats;
  const TailorDashboard({super.key, required this.shopName, required this.stats});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(shopName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0D3B66),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () => BlocProvider.of<AuthBloc>(context).add(LogoutRequested()), 
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Flexible(
                      child: Column(
                        children: [
                          // FIXED: Changed 'Center' to 'TextAlign.center'
                          const Text('Followers', textAlign: TextAlign.center), 
                          Text('${stats['follower_count'] ?? 0}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                    Container(width: 1, height: 40, color: Colors.grey[300]),
                    Flexible(
                      child: Column(
                        children: [
                          // FIXED: Changed 'Center' to 'TextAlign.center'
                          const Text('Rating', textAlign: TextAlign.center), 
                          Text('⭐ ${stats['rating'] ?? 0.0}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

void main() {
  runApp(const SmartSilaiApp());
}

class SmartSilaiApp extends StatelessWidget {
  const SmartSilaiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AuthBloc(),
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'SmartSilai',
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: const Color(0xFFFAF0CA), 
          colorScheme: const ColorScheme.light(
            primary: Color(0xFF0D3B66), 
            secondary: Color(0xFFEE964B),
            surface: Colors.white,           
            error: Color(0xFFF95738), 
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF95738),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        home: BlocBuilder<AuthBloc, AuthState>(
          builder: (context, state) {
            if (state is AuthLoading) {
              return const Scaffold(body: Center(child: CircularProgressIndicator()));
            }
            if (state is AuthAuthenticated) {
              if (state.role == 'Customer') {
                return CustomerDashboard(name: state.currentUserName);
              } else {
                return TailorDashboard(
                  shopName: state.sessionData['shop_name'] ?? 'Tailor Workshop',
                  stats: state.sessionData,
                );
              }
            }
            return const LoginPage();
          },
        ),
      ),
    );
  }
}