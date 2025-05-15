import React from 'react';
import { Button } from './ui/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white px-6 py-16">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Tu veux répondre comme un boss à ton crush ?
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 mb-8">
          LoveReplay est l’IA qui te génère des réponses irrésistibles pour tous tes messages amoureux.
        </p>
        <Button className="text-lg px-6 py-3">Commencer maintenant</Button>
      </section>

      {/* Comment ça marche */}
      <section className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Comment ça fonctionne ?</h2>
        <ol className="space-y-4 text-zinc-300 text-lg">
          <li>💌 Tu colles un message reçu (Insta, SMS, Snap...)</li>
          <li>🎭 Tu choisis ton style de réponse : flirty, drôle, savage...</li>
          <li>⚡ L’IA génère la meilleure punchline pour toi</li>
        </ol>
      </section>

      {/* Exemples */}
      <section className="mt-24 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Exemples de réponses LoveReplay</h2>
        <div className="bg-zinc-800 rounded-xl p-6 space-y-4 text-left text-zinc-200">
          <div>
            <strong>Elle :</strong> “Tu penses à moi ?” <br />
            <strong>LoveReplay :</strong> “Seulement quand mon cœur veut un peu de douceur.”
          </div>
          <div>
            <strong>Lui :</strong> “T’as fais quoi ce week-end ?” <br />
            <strong>LoveReplay :</strong> “J’ai survécu sans toi. C’est déjà beaucoup.”
          </div>
        </div>
      </section>

      {/* Appel à l’action */}
      <section className="mt-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à briller par message ?</h2>
        <Button className="text-lg px-6 py-3">Lancer LoveReplay maintenant</Button>
        <p className="text-zinc-400 mt-2">Gratuit, sans inscription.</p>
      </section>

      {/* Footer */}
      <footer className="mt-32 text-center text-zinc-500 text-sm">
        © 2025 LoveReplay. Made with ❤️ by NadOx.
      </footer>
    </div>
  ); 
};

export default LandingPage;
