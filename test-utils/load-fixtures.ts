import * as path from 'path';
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli/dist';

const loadByPath = async (connection: any) => {
  try {
    const loader = new Loader();
    loader.load(path.resolve('./fixtures'));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser(), true);

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);
      await connection.getRepository(entity.constructor.name).save(entity);
    }
  } catch (err) {
    throw err;
  }
};

export default async function loadFixtures(connection: any) {
  await loadByPath(connection);
}
