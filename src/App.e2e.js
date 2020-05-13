import { Selector } from 'testcafe'
import { waitForReact } from 'testcafe-react-selectors'
import { ClientFunction } from 'testcafe'

const testClient = ClientFunction((func, ...args) => {
  var funcs = func.split('.');
  var func = window;
  if(funcs.length>0 && funcs[0] == 'window') {
    func = {window:window};
  }
  funcs.forEach((f) => {func = func[f]})
  return func.apply(null, args);
})

fixture `Getting Started`
  .page `http://localhost:3000/`
  .beforeEach(async () => {
    await waitForReact()
  })

test('Check init display', async t => {
  await t
    .expect(Selector('button').innerText).eql('Add')
    .expect(Selector('input').count).eql(1)
    .expect(Selector('.alert').count).eql(0)
})

test('Create 1 task and check it item', async t => {
  await t
    .typeText('input', 'task 1')
    .click('button')
    .expect(Selector('.alert').innerText).eql('task 1')
})

test('Create 3 task and check it items', async t => {
  await t
    .typeText('input', 'task 1')
    .click('button')
    .typeText('input', 'task 2')
    .click('button')
    .typeText('input', 'task 3')
    .click('button')
    .expect(Selector('.alert').count).eql(3)
    .expect(Selector('.alert').nth(0).innerText).eql('task 1')
    .expect(Selector('.alert').nth(1).innerText).eql('task 2')
    .expect(Selector('.alert').nth(2).innerText).eql('task 3')
})

test('Gradually delete tasks and check it item', async t => {
  const page = new TodosPage();

  await page.fillForm(t)
  await t
    .click(Selector('.alert').nth(0))
    .expect(Selector('.alert').count).eql(2)
    .expect(Selector('.alert').nth(0).innerText).eql('task 2')
    .expect(Selector('.alert').nth(1).innerText).eql('task 3')
    .click(Selector('.alert').nth(1))
    .expect(Selector('.alert').nth(0).innerText).eql('task 2')
    .click(Selector('.alert').nth(0))
    .expect(Selector('.alert').count).eql(0)
})

test('Test function 1', async t => {
  await t
    .expect(testClient('getOne')).eql(1)
    .expect(testClient('getZero')).eql(0)
    .expect(testClient('window.getOne')).eql(1)
    .expect(testClient('window.getZero')).eql(0)
    .expect(testClient('window.addAll', 1, 2, 3, 4, 5)).eql(15)

})

class TodosPage {
  constructor () {
  }

  async fillForm(t) {
    await t
      .typeText('input', 'task 1')
      .click('button')
      .typeText('input', 'task 2')
      .click('button')
      .typeText('input', 'task 3')
      .click('button')
  }
}
