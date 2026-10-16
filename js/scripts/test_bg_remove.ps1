$code = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class BgRemover {
    public static void Process(string inputPath, string outputPath, int tolerance) {
        using (Bitmap src = new Bitmap(inputPath)) {
            int w = src.Width;
            int h = src.Height;
            Bitmap result = new Bitmap(w, h, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(result)) {
                g.DrawImage(src, 0, 0, w, h);
            }

            BitmapData data = result.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int bytes = Math.Abs(data.Stride) * h;
            byte[] rgb = new byte[bytes];
            Marshal.Copy(data.Scan0, rgb, 0, bytes);

            // Background color sampled from top-left corner
            byte bgB = rgb[0];
            byte bgG = rgb[1];
            byte bgR = rgb[2];

            bool[] visited = new bool[w * h];
            Queue<int> queue = new Queue<int>();

            // Enqueue all boundary pixels
            for (int x = 0; x < w; x++) {
                queue.Enqueue(x);
                queue.Enqueue((h - 1) * w + x);
            }
            for (int y = 0; y < h; y++) {
                queue.Enqueue(y * w);
                queue.Enqueue(y * w + (w - 1));
            }

            while (queue.Count > 0) {
                int idx = queue.Dequeue();
                if (idx < 0 || idx >= w * h) continue;
                if (visited[idx]) continue;
                visited[idx] = true;

                int x = idx % w;
                int y = idx / w;
                int byteIdx = y * data.Stride + x * 4;

                byte b = rgb[byteIdx];
                byte g = rgb[byteIdx + 1];
                byte r = rgb[byteIdx + 2];
                byte a = rgb[byteIdx + 3];

                if (a == 0) {
                    if (x > 0) queue.Enqueue(idx - 1);
                    if (x < w - 1) queue.Enqueue(idx + 1);
                    if (y > 0) queue.Enqueue(idx - w);
                    if (y < h - 1) queue.Enqueue(idx + w);
                    continue;
                }

                double dist = Math.Sqrt((r - bgR)*(r - bgR) + (g - bgG)*(g - bgG) + (b - bgB)*(b - bgB));
                bool isLight = (r > 220 && g > 220 && b > 220);

                if (dist <= tolerance || isLight) {
                    rgb[byteIdx + 3] = 0; // Transparent!
                    if (x > 0) queue.Enqueue(idx - 1);
                    if (x < w - 1) queue.Enqueue(idx + 1);
                    if (y > 0) queue.Enqueue(idx - w);
                    if (y < h - 1) queue.Enqueue(idx + w);
                }
            }

            Marshal.Copy(rgb, 0, data.Scan0, bytes);
            result.UnlockBits(data);
            result.Save(outputPath, ImageFormat.Png);
            result.Dispose();
            Console.WriteLine("Saved: " + outputPath);
        }
    }
}
"@
Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

[BgRemover]::Process("c:\Users\Kasthuri\OneDrive\Desktop\4RGE-Platform-main\raw_bottles\AMRUT-SGL-750.jpg", "C:\Users\Kasthuri\OneDrive\Desktop\Tasmac e commerce\images\amrut-fusion.png", 35)

