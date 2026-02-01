import { Card, CardHeader, CardContent } from '../components/ui';

const planets = [
  {
    name: 'Mercury',
    type: 'Terrestrial',
    distance: '0.39 AU',
    moons: 0,
    description: 'The smallest planet and closest to the Sun.',
    color: 'bg-gray-400',
  },
  {
    name: 'Venus',
    type: 'Terrestrial',
    distance: '0.72 AU',
    moons: 0,
    description: 'The hottest planet with a thick, toxic atmosphere.',
    color: 'bg-yellow-600',
  },
  {
    name: 'Earth',
    type: 'Terrestrial',
    distance: '1.00 AU',
    moons: 1,
    description: 'Our home planet, the only known world with life.',
    color: 'bg-blue-500',
  },
  {
    name: 'Mars',
    type: 'Terrestrial',
    distance: '1.52 AU',
    moons: 2,
    description: 'The Red Planet, a target for human exploration.',
    color: 'bg-red-500',
  },
  {
    name: 'Jupiter',
    type: 'Gas Giant',
    distance: '5.20 AU',
    moons: 95,
    description: 'The largest planet with a famous Great Red Spot.',
    color: 'bg-orange-400',
  },
  {
    name: 'Saturn',
    type: 'Gas Giant',
    distance: '9.58 AU',
    moons: 146,
    description: 'Known for its stunning ring system.',
    color: 'bg-yellow-400',
  },
  {
    name: 'Uranus',
    type: 'Ice Giant',
    distance: '19.22 AU',
    moons: 28,
    description: 'An ice giant that rotates on its side.',
    color: 'bg-cyan-400',
  },
  {
    name: 'Neptune',
    type: 'Ice Giant',
    distance: '30.05 AU',
    moons: 16,
    description: 'The windiest planet, with speeds over 1,200 mph.',
    color: 'bg-blue-700',
  },
];

export function Planets() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Solar System Planets</h1>
        <p className="mt-2 text-gray-600">
          Explore all 8 planets in our Solar System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planets.map((planet) => (
          <Card key={planet.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full ${planet.color}`} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{planet.name}</h2>
                  <span className="text-sm text-indigo-600 font-medium">{planet.type}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{planet.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Distance from Sun</span>
                  <span className="font-medium text-gray-900">{planet.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Moons</span>
                  <span className="font-medium text-gray-900">{planet.moons}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
