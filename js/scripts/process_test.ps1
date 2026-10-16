$code = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;

public class TestPing {
    public static void Ping() {
        Console.WriteLine("C# in PowerShell works perfectly!");
    }
}
"@
Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
[TestPing]::Ping()

