import 'package:flutter/material.dart';

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
  final Map<String, dynamic> productosDemo = {
    'PROD001': {'nombre': 'Silla de Oficina', 'precio': 59.99, 'cantidad': 10, 'stock_minimo': 3},
    'PROD002': {'nombre': 'Mesa de Trabajo', 'precio': 99.99, 'cantidad': 5, 'stock_minimo': 2},
    'PROD003': {'nombre': 'Teclado Mecánico', 'precio': 79.99, 'cantidad': 15, 'stock_minimo': 5},
  };

  Map<String, dynamic>? producto;
  String mensaje = '';
  Color mensajeColor = Colors.green;

  @override
  void initState() {
    super.initState();
    procesarQR();
  }

  void procesarQR() {
    final encontrado = productosDemo[widget.qrCode];

    if (encontrado == null) {
      setState(() {
        mensaje = 'Producto no encontrado';
        mensajeColor = Colors.red;
      });
      return;
    }

    setState(() => producto = Map.from(encontrado));

    if (widget.accion == 'agregar') {
      setState(() {
        producto!['cantidad'] = producto!['cantidad'] + widget.cantidad;
        mensaje = '✅ Se agregaron ${widget.cantidad} unidades correctamente';
        mensajeColor = Colors.green;
      });
    } else if (widget.accion == 'descontar') {
      if (producto!['cantidad'] < widget.cantidad) {
        setState(() {
          mensaje = '❌ Stock insuficiente';
          mensajeColor = Colors.red;
        });
      } else {
        setState(() {
          producto!['cantidad'] = producto!['cantidad'] - widget.cantidad;
          mensaje = '✅ Se descontaron ${widget.cantidad} unidades correctamente';
          mensajeColor = Colors.green;
        });
      }
    } else {
      setState(() {
        mensaje = 'ℹ️ Información del producto';
        mensajeColor = Colors.blue;
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
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (producto != null) ...[
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: Colors.grey.shade200, blurRadius: 10)],
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.inventory_2, size: 60, color: Colors.blue),
                      const SizedBox(height: 16),
                      Text(producto!['nombre'],
                          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Column(children: [
                            const Text('Precio', style: TextStyle(color: Colors.grey)),
                            Text('\$${producto!['precio']}',
                                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.blue)),
                          ]),
                          Column(children: [
                            const Text('Stock', style: TextStyle(color: Colors.grey)),
                            Text('${producto!['cantidad']}',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: producto!['cantidad'] < producto!['stock_minimo']
                                      ? Colors.red
                                      : Colors.green,
                                )),
                          ]),
                          Column(children: [
                            const Text('Mínimo', style: TextStyle(color: Colors.grey)),
                            Text('${producto!['stock_minimo']}',
                                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                          ]),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
              ],
              if (mensaje.isNotEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: mensajeColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: mensajeColor),
                  ),
                  child: Text(mensaje,
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 16, color: mensajeColor, fontWeight: FontWeight.bold)),
                ),
              const SizedBox(height: 40),
              ElevatedButton.icon(
                onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
                icon: const Icon(Icons.home),
                label: const Text('Volver al inicio'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(200, 50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}