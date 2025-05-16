import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Zap, Heart } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white px-6 py-12 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center shadow-xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 leading-tight tracking-tight">
          Une IA qui répond à tes messages pour toi 💬
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          Tu reçois un message de ton crush, ton ex ou un(e) inconnu(e) ? Tu sais pas quoi répondre ?  
          LoveReplay t’écrit la réponse parfaite à ta place. En un clic.
        </p>

        <a
          href="/app"
          className="bg-pink-600 hover:bg-pink-700 transition text-white font-semibold px-8 py-3 rounded-full shadow-lg text-lg"
        >
          ✨ Essayer gratuitement
        </a>

        <div className="mt-16 text-left">
          <h2 className="text-2xl font-semibold mb-6 text-center">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-900 rounded-2xl p-6 shadow-lg">
              <MessageCircle className="w-8 h-8 text-pink-400 mb-3" />
              <h3 className="text-lg font-semibold mb-2">1. Colle le message reçu</h3>
              <p className="text-gray-400">Tu colles le message que tu viens de recevoir sur Insta, Snap, Tinder ou WhatsApp.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-900 rounded-2xl p-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-pink-400 mb-3" />
              <h3 className="text-lg font-semibold mb-2">2. Choisis un ton</h3>
              <p className="text-gray-400">Romantique ? Froid ? Marrant ? Tu choisis le style de réponse que tu veux.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-900 rounded-2xl p-6 shadow-lg">
              <Zap className="w-8 h-8 text-pink-400 mb-3" />
              <h3 className="text-lg font-semibold mb-2">3. Obtiens ta réponse parfaite</h3>
              <p className="text-gray-400">L’IA te génère une réponse stylée, naturelle et prête à être envoyée.</p>
            </motion.div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-xl font-semibold text-gray-400">+ de 10 000 messages générés. C’est à ton tour 😏</h2>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
