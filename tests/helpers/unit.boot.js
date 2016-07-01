import td from 'testdouble';
import chai from 'chai';
import tdChai from 'testdouble-chai';
// import chaiEnzyme from 'chai-enzyme';

// do not use until https://github.com/producthunt/chai-enzyme/issues/13
// extend chai with enzyme
// chai.use(chaiEnzyme());

// extend chai with td
chai.use(tdChai(td));
