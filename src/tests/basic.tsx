import { style, stylesheet, getStyles, reinit, classes, cssRule, createTypeStyle } from '../index';
import * as assert from 'assert';

describe("initial test", () => {
  it("should pass", () => {
    reinit();
    assert(getStyles() === '');

    style({ color: 'red' });
    assert.equal(getStyles(), '.f1jvcvsh{color:red}');
  });

  it("reinit should clear", () => {
    reinit();
    assert(getStyles() === '');

    style({ color: 'red' });
    assert.equal(getStyles(), '.f1jvcvsh{color:red}');
  });

  it("child same", () => {
    reinit();
    style({ color: 'red', $nest: { '&>*': { color: 'red' } } });
    assert.equal(getStyles(), '.fxvpbc,.fxvpbc>*{color:red}');
  });

  it("child same unique", () => {
    reinit();
    style({ color: 'red', $nest: { '&>*': { color: 'red', $unique: true } } });
    assert.equal(getStyles(), '.fxvpbc{color:red}.fxvpbc>*{color:red}');
  });

  it("child different", () => {
    reinit();
    style({ color: 'red', $nest: { '&>*': { color: 'blue' } } });
    assert.equal(getStyles(), '.f17jnn39{color:red}.f17jnn39>*{color:blue}');
  });

  it("media same", () => {
    reinit();
    style({
      color: 'red',
      $nest: {
        '@media (min-width: 400px)': { color: 'red' }
      }
    });
    assert.equal(getStyles(), '.f7u1jp4{color:red}@media (min-width: 400px){.f7u1jp4{color:red}}');
  });

  it("media different", () => {
    reinit();
    style({ color: 'red', $nest: { '@media (min-width: 400px)': { color: 'blue' } } });
    assert.equal(getStyles(), '.f13h18xh{color:red}@media (min-width: 400px){.f13h18xh{color:blue}}');
  });

  it("classes should compose", () => {
    assert.equal(classes("a", "b"), "a b");
    assert.equal(classes("a", false && "b"), "a");
    assert.equal(classes("a", false && "b", "c"), "a c");
    assert.equal(classes("a", false && "b", "c", { d: false, e: true }, { f: {}, g: null }), "a c e f");
  });

  it("transparent string should render transparent in color property", () => {
    reinit();
    cssRule('.transparent', { color: 'transparent' });
    style({ color: 'transparent' });
    assert.equal(getStyles(), '.transparent{color:transparent}.fwarpl0{color:transparent}');
  });

  it("should support dedupe by default", () => {
    reinit();
    style({
      color: 'blue',
      $nest: {
        '&::-webkit-input-placeholder': {
          color: `rgba(0, 0, 0, 0)`,
        },
        '&::-moz-placeholder': {
          color: `rgba(0, 0, 0, 0)`,
        },
        '&::-ms-input-placeholder': {
          color: `rgba(0, 0, 0, 0)`,
        }
      }
    });
    assert.equal(getStyles(), '.f1p4wti2{color:blue}.f1p4wti2::-webkit-input-placeholder,.f1p4wti2::-moz-placeholder,.f1p4wti2::-ms-input-placeholder{color:rgba(0, 0, 0, 0)}');
  });

  it("should support $unique", () => {
    reinit();
    style({
      color: 'blue',
      $nest: {
        '&::-webkit-input-placeholder': {
          $unique: true,
          color: `rgba(0, 0, 0, 0)`,
        },
        '&::-moz-placeholder': {
          $unique: true,
          color: `rgba(0, 0, 0, 0)`,
        },
        '&::-ms-input-placeholder': {
          $unique: true,
          color: `rgba(0, 0, 0, 0)`,
        }
      }
    });
    assert.equal(getStyles(), '.f1p4wti2{color:blue}.f1p4wti2::-webkit-input-placeholder{color:rgba(0, 0, 0, 0)}.f1p4wti2::-moz-placeholder{color:rgba(0, 0, 0, 0)}.f1p4wti2::-ms-input-placeholder{color:rgba(0, 0, 0, 0)}');
  });

  it("should support $debugName", () => {
    reinit();
    style({
      $debugName: 'sample',
      color: 'blue',
      $nest: {
        '&:hover': {
          color: 'rgba(0, 0, 0, 0)',
        }
      }
    });
    assert.equal(getStyles(), '.sample_fyguhj9{color:blue}.sample_fyguhj9:hover{color:rgba(0, 0, 0, 0)}');
  });

  it("should generate meaningful classnames using stylesheet", () => {
    reinit();
    const classes = stylesheet({
      warning: {
        color: 'red'
      },
      success: {
        color: 'green'
      }
    });
    assert.deepEqual(classes, {
      warning: 'warning_f1jvcvsh',
      success: 'success_fmubem1'
    });
    assert.equal(getStyles(), '.warning_f1jvcvsh{color:red}.success_fmubem1{color:green}');
  })

  it("style should ignore 'false' 'null' and 'undefined'", () => {
    reinit();
    style(
      { color: 'blue' },
      false && { color: 'red' },
      null,
      undefined,
      { backgroundColor: 'red' }
    );
    assert.equal(getStyles(), '.fb25ljk{background-color:red;color:blue}');
  });

  it("should generate unique instances when typestyle() is called", () => {
    const ts1 = createTypeStyle({ textContent: '' });
    const ts2 = createTypeStyle({ textContent: '' });

    ts1.style({ fontSize: 14 });
    ts2.style({ fontSize: 16 });

    assert.equal(ts1.getStyles(), '.fc4zu15{font-size:14px}');
    assert.equal(ts2.getStyles(), '.f1rwc7t7{font-size:16px}');
  });

  it("should work if no target is set on an instance", () => {
    const ts = createTypeStyle();
    ts.cssRule('body', { fontSize: 12 });

    assert.equal(ts.getStyles(), 'body{font-size:12px}');
  });
})
