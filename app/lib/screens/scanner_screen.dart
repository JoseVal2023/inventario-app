import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'resultado_screen.dart';

class ScannerScreen extends StatefulWidget {
  final String accion;
  const ScannerScreen({super.key, required this.accion});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  bool escaneado = false;
  int cantidad = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Escanear — ${widget.accion}'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          if (widget.accion != 'info')
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Cantidad:', style: TextStyle(fontSize: 18)),
                  const SizedBox(width: 20),
                  IconButton(
                    icon: const Icon(Icons.remove),
                    onPressed: () => setState(() => cantidad = cantidad > 1 ? cantidad - 1 : 1),
                  ),
                  Text('$cantidad', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: () => setState(() => cantidad++),
                  ),
                ],
              ),
            ),
          Expanded(
            child: MobileScanner(
              onDetect: (capture) {
                if (!escaneado) {
                  final barcode = capture.barcodes.first;
                  if (barcode.rawValue != null) {
                    setState(() => escaneado = true);
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ResultadoScreen(
                          qrCode: barcode.rawValue!,
                          accion: widget.accion,
                          cantidad: cantidad,
                        ),
                      ),
                    );
                  }
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}