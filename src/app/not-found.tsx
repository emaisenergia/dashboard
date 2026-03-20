export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen" style={{ background: 'hsl(222 47% 7%)', color: 'hsl(210 40% 90%)' }}>
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-lg" style={{ color: 'hsl(215 20% 55%)' }}>Página não encontrada</p>
            </div>
        </div>
    );
}
