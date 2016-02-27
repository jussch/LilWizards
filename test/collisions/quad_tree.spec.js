/**
 * Created by Justin on 2016-02-26.
 */
'use strict';
import QuadTree from '../../src/js/utilities/quad_tree';
import _ from 'lodash';

function createRect(x, y, width, height, angle) {
  return { x: x, y: y, width: width, height: height };
}

describe('Quad Trees', function () {

  describe('#retrieve', function () {

    let quad;
    beforeEach(function () {
      quad = new QuadTree(1, createRect(0, 0, 100, 100));
      _.times(15, () => {
        quad.insert(createRect(5, 5, 2, 2));
      });
    });

    it('should retrieve properly', function () {
      const objs = quad.retrieve(createRect(5, 5, 5, 5));
      expect(objs.length).to.be.equal(15);
    });

    it('should correctly retrieve nothing', () => {
      const objs = quad.retrieve(createRect(60, 60, 5, 5));
      expect(objs.length).to.be.equal(0);
    });

    it('should correctly retrieve middle items', () => {
      quad.insert(createRect(40, 40, 20, 20));
      const objs = quad.retrieve(createRect(60, 60, 5, 5));
      expect(objs.length).to.be.equal(1);
    });

    it('should correctly retrieve nested items when in middle', () => {
      quad.insert(createRect(60, 60, 5, 5));
      const objs = quad.retrieve(createRect(40, 40, 20, 20));
      expect(objs.length).to.be.equal(1);
    });

    it('should correctly retrieve middle items when in middle', () => {
      quad.insert(createRect(45, 45, 10, 10));
      const objs = quad.retrieve(createRect(40, 40, 21, 21));
      expect(objs.length).to.be.equal(1);
    });

    it('should retrieve only objects that it is close to when in middle', () => {
      _.times(15, () => {
        quad.insert(createRect(55, 55, 2, 2));
      });
      const objs = quad.retrieve(createRect(40, 40, 20, 20));
      expect(objs.length).to.be.equal(15);
    });

    it('should correctly retrieve out of bounds collisions', () => {
      const objs = quad.retrieve(createRect(-10, -10, 5, 5));
      expect(objs.length).to.be.equal(15);

      const objs2 = quad.retrieve(createRect(105, 105, 5, 5));
      expect(objs2.length).to.be.equal(0);
    });

  });

});
