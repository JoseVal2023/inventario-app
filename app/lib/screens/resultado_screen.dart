import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class ResultadoScreen extends StatefulWidget {
  final String qrCode;
  final String accion;
  final int cantidad;

  const ResultadoScreen({
    super.key,
    required this.qrCode,
    required this.accion,
    required this.cantidad,
  });

  @override
  State<ResultadoScreen> createState() => _ResultadoScreenState();
}

class _ResultadoScreenState extends State<ResultadoScreen> {
  Map<String, dynamic>? producto;
  String mensaje = '';
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    procesarQR();
  }

  Future<void> procesarQR() async {
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8000/productos'),
      );
      final data = jsonDecode(response.body);
      final productos = data['productos'] as List;
      final encontrado = productos.firstWhere(
        (p) => p['qr_code'] == widget.qrCode,
        orElse: () => null,
      );

      if (encontrado == null) {
        setState(() {
          mensaje = 'Producto no encontrado';
          cargando = false;
        });
        return;
      }

      setState(() => producto = encontrado);

      if (widget.accion == 'agregar') {
        await http.post(
          Uri.parse('http://10.0.2.2:8000/productos/${encontrado['id']}/agregar'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'cantidad': widget.cantidad, 'origen': 'app'}),
        );
        setState(() => mensaje = 'Stock agregado correctamente');
      } else if (widget.accion == 'descontar') {
        await http.post(
          Uri.parse('http://10.0.2.2:8000/productos/${encontrado['id']}/descontar'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'cantidad': widget.cantidad, 'origen': 'app'}),
        );
        setState(() => mensaje = 'Stock descontado correctamente');
      }

      setState(() => cargando = false);
    } catch (e) {
      setState(() {
        mensaje = 'Error al conectar con el servidor';
        cargando = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resultado'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (producto != null) ...[
                      Text(producto!['nombre'],
                          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      Text('Precio: \$${producto!['precio']}',
                          style: const TextStyle(fontSize: 20)),
                      const SizedBox(height: 8),
                      Text('Stock actual: ${producto!['cantidad']}',
                          style: const TextStyle(fontSize: 20)),
                      const SizedBox(height: 8),
                      Text('Stock mínimo: ${producto!['stock_minimo']}',
                          style: const TextStyle(fontSize: 20)),
                    ],
                    if (mensaje.isNotEmpty) ...[
                      const SizedBox(height: 24),
                      Text(mensaje,
                          style: const TextStyle(fontSize: 18, color: Colors.green)),
                    ],
                    const SizedBox(height: 40),
                    ElevatedButton(
                      onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
                      child: const Text('Volver al inicio'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}