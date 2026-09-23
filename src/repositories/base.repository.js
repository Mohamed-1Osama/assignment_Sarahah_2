
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data, options = {}) {
    const [doc] = await this.model.create([data], options); 
    return doc;
  }

  async findById(id, { select = null, populate = null, session = null } = {}) {
    let query = this.model.findById(id).session(session);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    return query;
  }

  async findOne(filter, { select = null, populate = null, session = null } = {}) {
    let query = this.model.findOne(filter).session(session);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    return query;
  }

  async findAll(filter = {}, { select = null, sort = '-createdAt', page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);
    if (select) query = query.select(select);
    const [items, total] = await Promise.all([query, this.model.countDocuments(filter)]);
    return { items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) };
  }

  async updateById(id, update, { session = null, new: returnNew = true } = {}) {
    return this.model.findByIdAndUpdate(id, update, {
      new: returnNew,
      runValidators: true,
      session,
    });
  }

  async deleteById(id, { session = null } = {}) {
    return this.model.findByIdAndDelete(id, { session });
  }

  async exists(filter) {
    return this.model.exists(filter);
  }
}

module.exports = BaseRepository;
