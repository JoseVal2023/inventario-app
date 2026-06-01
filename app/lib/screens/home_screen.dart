import 'package:flutter/material.dart';
import 'scanner_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sistema de Inventario'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              '¿Qué deseas hacer?',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 40),
            ElevatedButton.icon(
              icon: const Icon(Icons.qr_code_scanner),
              label: const Text('Ver información del producto'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(280, 60),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
              ),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ScannerScreen(accion: 'info'),
                ),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              icon: const Icon(Icons.add_circle),
              label: const Text('Agregar stock'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(280, 60),
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              ),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ScannerScreen(accion: 'agregar'),
                ),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              icon: const Icon(Icons.remove_circle),
              label: const Text('Descontar stock'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(280, 60),
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ScannerScreen(accion: 'descontar'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}