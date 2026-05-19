import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_event.dart';

class CustomerDashboard extends StatelessWidget {
  final String name;
  const CustomerDashboard({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    // Mock data array simulating a SQL JOIN between your 'posts' and 'tailors' tables
    final List<Map<String, dynamic>> mockInstagramFeed = [
      {
        "id": 1,
        "shop_name": "StitchCraft Studio",
        "specialization": "Blouse Designer, Kurtis",
        "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8", 
        "description": "Custom hand-embroidered wedding Kurti set completed for a client! Drop a message to book your slot. ❤️ #designerwear #kurti",
        "likes_count": 245,
        "rating": 4.8
      },
      {
        "id": 2,
        "shop_name": "Royal Royal Tailors",
        "specialization": "Suits & Indo-Western",
        "image_url": "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
        "description": "Perfect premium fits for the upcoming festival season. Book an appointment today for seamless tailoring.",
        "likes_count": 189,
        "rating": 4.5
      }
    ];

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text('Hello, $name 👋', style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0.5,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => BlocProvider.of<AuthBloc>(context).add(LogoutRequested()),
          )
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: mockInstagramFeed.length,
        itemBuilder: (context, index) {
          final post = mockInstagramFeed[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            clipBehavior: Clip.antiAlias,
            elevation: 1,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header: Tailor Info Card Detail
                ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.blueAccent.withOpacity(0.1),
                    child: const Icon(Icons.storefront, color: Colors.blueAccent),
                  ),
                  title: Text(post['shop_name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(post['specialization'], style: const TextStyle(fontSize: 12)),
                  trailing: ElevatedButton(
                    onPressed: () {
                      showModalBottomSheet(
                        context: context,
                        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
                        builder: (context) => Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Text('Book Appointment with ${post['shop_name']}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 8),
                              Text('Rating: ⭐ ${post['rating']}'),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Appointment Slot Requested Successfully!')),
                                  );
                                },
                                style: ElevatedButton.styleFrom(backgroundColor: Colors.blueAccent, foregroundColor: Colors.white),
                                child: const Text('Confirm Booking Request'),
                              ),
                            ],
                          ),
                        );
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blueAccent,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text('Book'),
                  ),
                ),
                
                // The Post Image (Influencer Workspace Showcase)
                Container(
                  height: 300,
                  width: double.infinity,
                  color: Colors.blueGrey[100],
                  child: Image.network(
                    post['image_url'],
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return const Center(child: Icon(Icons.broken_image, size: 50, color: Colors.grey));
                    },
                  ),
                ),

                // Interaction Action Panel Row
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.favorite, color: Colors.redAccent, size: 24),
                          const SizedBox(width: 8),
                          Text('${post['likes_count']} likes', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          const Spacer(),
                          Text('⭐ ${post['rating']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      RichText(
                        text: TextSpan(
                          style: const TextStyle(color: Colors.black, fontSize: 14),
                          children: [
                            TextSpan(text: '${post['shop_name']} ', style: const TextStyle(fontWeight: FontWeight.bold)),
                            TextSpan(text: post['description'], style: TextStyle(color: Colors.grey[800])),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}