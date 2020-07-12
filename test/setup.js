process.env.TZ = "UTC";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET =
  "F3AF6D7AD0C4A29617B02846BE28C6A4A64E5FD3D6D02CF3BF9CB50D01A745B9";

require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");

global.expect = expect;
global.supertest = supertest;
