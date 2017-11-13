import td from 'testdouble';
import chai from 'chai';
import tdChai from 'testdouble-chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Setup enzyme
Enzyme.configure({ adapter: new Adapter() });

// extend chai with td
chai.use(tdChai(td));
