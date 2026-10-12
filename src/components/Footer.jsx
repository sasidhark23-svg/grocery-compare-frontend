import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const commonsCredits = [
  { item: 'Paneer', author: 'SuVaM Epicure', license: 'CC BY-SA 4.0', file: 'Barbequed_Paneer_Tikka.jpg', path: '2/27/Barbequed_Paneer_Tikka.jpg', version: '4.0' },
  { item: 'Tomato', author: 'Mr. Snatch', license: 'CC BY-SA 4.0', file: 'Bounty_of_Fresh_Tomatoes.jpg', path: 'f/f3/Bounty_of_Fresh_Tomatoes.jpg', version: '4.0' },
  { item: 'Red onion', author: 'Grace789', license: 'CC BY-SA 4.0', file: 'Bulk_red_onions_vegetables,_April_2023.jpg', path: '2/2f/Bulk_red_onions_vegetables%2C_April_2023.jpg', version: '4.0' },
  { item: 'Potato', author: 'HaJunkiyada', license: 'CC BY-SA 4.0', file: 'Liat_Portal_for_Foodie_Disorder_-_Potatoes_from_San_Francisco_farmers_market.jpg', path: '2/2d/Liat_Portal_for_Foodie_Disorder_-_Potatoes_from_San_Francisco_farmers_market.jpg', version: '4.0' },
  { item: 'Green capsicum', author: 'Alabama Extension', license: 'CC0', file: 'Chopped_Green_Bell_Pepper.jpg', path: '8/82/Chopped_Green_Bell_Pepper.jpg', version: null },
  { item: 'Carrot', author: 'Ramesh NG', license: 'CC BY-SA 2.0', file: 'Carrot_on_plate.jpg', path: 'b/ba/Carrot_on_plate.jpg', version: '2.0' },
  { item: 'Cucumber', author: 'Daderot', license: 'CC0', file: 'Cucumber_on_tomato_-_20180903_130208.jpg', path: '7/72/Cucumber_on_tomato_-_20180903_130208.jpg', version: null },
  { item: 'Alphonso mango', author: 'umstwit', license: 'CC BY 2.0', file: 'Alphonso_Ripe_Mango_from_north_India.jpg', path: '8/88/Alphonso_Ripe_Mango_from_north_India.jpg', version: '2.0' },
  { item: 'Pomegranate', author: 'Augustus Binu', license: 'CC BY-SA 3.0', file: 'Pomegranate_(fruit).jpg', path: 'c/c8/Pomegranate_%28fruit%29.jpg', version: '3.0' },
  { item: 'Brown rice', author: 'Gaurav Dhwaj Khadka', license: 'CC BY-SA 4.0', file: 'Brown_Rice.jpg', path: '5/5c/Brown_Rice.jpg', version: '4.0' },
  { item: 'Rajma', author: 'Aniketalam', license: 'CC BY-SA 4.0', file: 'Kinnauri_Rajma.jpg', path: '4/43/Kinnauri_Rajma.jpg', version: '4.0' },
  { item: 'Coca-Cola', author: 'Kanesue', license: 'CC BY 2.0', file: 'Bottle_of_Coca-Cola_with_a_glass_(52267699916).jpg', path: 'd/d6/Bottle_of_Coca-Cola_with_a_glass_%2852267699916%29.jpg', version: '2.0' },
  { item: 'Ariel', author: 'Kjetil Ree', license: 'CC BY-SA 3.0', file: 'Ariel_pods.jpg', path: 'a/a0/Ariel_pods.jpg', version: '3.0' },
  { item: 'Colgate', author: 'Nord794ub', license: 'CC BY-SA 4.0', file: '2022_Colgate_Toothpaste_for_Russia_market_assorted.jpg', path: '0/0b/2022_Colgate_Toothpaste_for_Russia_market_assorted.jpg', version: '4.0' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">GroceryCompare</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Compare clearly labelled sample grocery listings and plan everyday shopping with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition">Home</Link></li>
              <li><Link to="/search" className="hover:text-emerald-400 transition">Search & Compare</Link></li>
              <li><Link to="/lists" className="hover:text-emerald-400 transition">Shopping Lists</Link></li>
              <li><Link to="/favorites" className="hover:text-emerald-400 transition">Favorites</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Popular Stores</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Reliance Smart</li>
              <li>DMart</li>
              <li>BigBasket</li>
              <li>Amazon Fresh</li>
              <li>Blinkit</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Lowest Price Engine</li>
              <li>Shopping List Optimizer</li>
              <li>Price Drop Alerts</li>
              <li>Price History Charts</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GroceryCompare. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for smart grocery shoppers</span>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">Sample prices and store availability are illustrative and are not live retailer data.</p>
        <div className="mt-3 text-center text-xs text-gray-500">
          <p>
            Product photos from <a href="https://world.openfoodfacts.org/" target="_blank" rel="noreferrer" className="underline hover:text-emerald-400">Open Food Facts</a>, <a href="https://world.openproductsfacts.org/" target="_blank" rel="noreferrer" className="underline hover:text-emerald-400">Open Products Facts</a>, and <a href="https://world.openbeautyfacts.org/" target="_blank" rel="noreferrer" className="underline hover:text-emerald-400">Open Beauty Facts</a> under their <a href="https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/tutorials/license-be-on-the-legal-side/" target="_blank" rel="noreferrer" className="underline hover:text-emerald-400">open-data/photo licenses</a>. Produce and other reference photos are credited below.
          </p>
          <details className="mx-auto mt-2 max-w-4xl text-left">
            <summary className="cursor-pointer text-center underline hover:text-emerald-400">Open photo credits and licenses</summary>
            <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {commonsCredits.map((credit) => (
                <li key={credit.file}>
                  {credit.item}: <a href={`https://commons.wikimedia.org/wiki/File:${credit.file}`} target="_blank" rel="noreferrer" className="underline hover:text-emerald-400">{credit.author}</a> · <a href={credit.version ? `https://creativecommons.org/licenses/${credit.license.toLowerCase().replace(' ', '-')}/${credit.version}/` : 'https://creativecommons.org/publicdomain/zero/1.0/'} target="_blank" rel="noreferrer" className="underline hover:text-emerald-400">{credit.license}</a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </footer>
  );
}
