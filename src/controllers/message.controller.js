const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const messageService = require('../services/message.service');

const send = catchAsync(async (req, res) => {
  const message = await messageService.send({
    ...req.body,
    senderId: req.user._id,
    file: req.file,
  });
  new ApiResponse(201, message, 'Confession sent').send(res);
});

const inbox = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await messageService.listInbox(req.user._id, { page, limit });
  new ApiResponse(200, result.items, 'Inbox fetched', {
    total: result.total,
    page: result.page,
    pages: result.pages,
  }).send(res);
});

const markRead = catchAsync(async (req, res) => {
  const message = await messageService.markRead(req.params.id, req.user._id);
  new ApiResponse(200, message, 'Message marked as read').send(res);
});

const remove = catchAsync(async (req, res) => {
  await messageService.remove(req.params.id, req.user._id);
  new ApiResponse(200, null, 'Message deleted').send(res);
});

module.exports = { send, inbox, markRead, remove };
