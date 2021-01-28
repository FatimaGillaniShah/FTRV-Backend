class TestController {
  print(req, res) {
    res.json('hello');
  }
}

export default new TestController();
