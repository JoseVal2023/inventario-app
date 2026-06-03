import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final contrasenaController = TextEditingController();
  String error = '';
  bool cargando = false;

  Future<void> handleLogin() async {
    setState(() { cargando = true; error = ''; });
    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:8000/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': emailController.text,
          'contrasena': contrasenaController.text,
        }),
      );
      final data = jsonDecode(response.body);
      if (data['error'] != null) {
        setState(() { error = data['error']; cargando = false; });
        return;
      }
      if (data['rol'] == 'admin') {
        setState(() { error = 'Los administradores deben usar la web.'; cargando = false; });
        return;
      }
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const HomeScreen()),
      );
    } catch (e) {
      setState(() { error = 'Error al conectar con el servidor'; cargando = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue.shade600,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('📦', style: TextStyle(fontSize: 48)),
                  const SizedBox(height: 8),
                  const Text('Inventario', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blue)),
                  const SizedBox(height: 4),
                  const Text('Acceso de operadores', style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 24),
                  TextField(
                    controller: emailController,
                    decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: contrasenaController,
                    decoration: const InputDecoration(labelText: 'Contraseña', border: OutlineInputBorder()),
                    obscureText: true,
                  ),
                  if (error.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(error, style: const TextStyle(color: Colors.red)),
                  ],
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: cargando ? null : handleLogin,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: cargando
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Iniciar Sesión', style: TextStyle(fontSize: 16)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}