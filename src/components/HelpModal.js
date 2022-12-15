import React, { Component } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import './HelpModal.css';

export default class HelpModal extends Component {
  render() {
    let displayClass = this.props.showHelpModal ? 'show' : 'hide';

    return (
      <div className={`HelpModal ${displayClass}`}>
        <div className="HelpModal-content">
          <span
            onClick={this.props.toggleHelpModal}
            className="HelpModal-close-btn"
          >
            &times;
          </span>
          <div className="HelpModal-header">
            <h1>Using GIFsmos V</h1>
          </div>
          <div className="HelpModal-text">
            <OverlayScrollbarsComponent
              className="overlay-scrollbar"
              defer
            >
              <h3>Creating, importing and saving graphs</h3>
              <p>
                Start by making something dynamic and awesome in the Desmos
                graphing calculator! You can do that right inside of GIFsmos V, or
                you can import one of your saved graphs from desmos.com by pasting
                its URL into the expressions list in GIFsmos V, and it will be
                automatically imported for you.
              </p>
              <p>
                Conversely, if you build something great in GIFsmos V that you
                want to save to your Desmos account, click "edit graph on Desmos"
                (at the bottom of the expressions list or the graph paper), and it
                will open a copy of your graph on desmos.com.
              </p>
              <p>
                To learn more about using the graphing calculator to build cool
                stuff, check out the Learn Desmos resources.
              </p>
              <h3>Capturing snapshots</h3>
              <p>
                GIFsmos V generates your animated SVG from a list of snapshots
                taken from the graph paper. You can add a single frame to the list
                by clicking the camera button.
              </p>
              <p>
                GIFsmos V also has a multi-capture mode that lets you generate
                multiple snapshots from a slider in the graphing calculator. Open
                the multi-capture panel and enter the relevant information in the
                input fields:
              </p>
              <h4>Option Description</h4>
              <h5>Slider Index</h5> The index of the expression that contains the
              slider values you want to capture.
              <h5>Slider Min</h5>The first slider value to capture.
              <h5>Slider Max</h5>The last slider value to capture.
              <h5>Manual Step</h5>Mode to manually control slider steps and
              frame interval.
              <h6>Slider Step</h6>How much to increment the slider in-between
              captures (controls the smoothness of the animation).
              <h6>Interval</h6>How much time to wait in-between captures in ms
              (controls the speed of the animation).
              <h5>Auto Step</h5>Mode to automatically calculate slider steps
              and frame interval based on target animation FPS and duration.
              <h6>Target FPS</h6>Target animation FPS.
              <h6>Duration</h6>Target animation duration in ms.
              <h6>Ease Slope</h6>Slider step ease factor (default = linear).
              <h6>Ease Pos</h6>Slider step ease timing (default = center).
              <p>
                Finally, click the "Capture" button, and GIFsmos V will
                automatically capture one snapshot for each slider value defined
                by the min, max, and step.
              </p>
              <h3>Previewing</h3>
              <p>
                Click the preview button to open the preview panel. You can
                preview your future SVG animation either by scrubbing through the
                snapshots with the slider, or by clicking the play/pause button on
                the preview image. The animation will run at (roughly) a speed
                determined by the "Interval" option in the burst panel, so it
                will give you a good idea what the final SVG animation will look
                like.
              </p>
              <h3>Adjusting image settings</h3>
              <p>
                Click the settings button to open the settings panel. There you
                can set the desired image dimensions (applies to both the captured
                snapshots and the final SVG animation), as well as the viewport
                computing strategy.
              </p>
              <h3>Generating and downloading a SVG</h3>
              <p>
                Inside the preview panel, once you're happy with the results,
                click the "Download SVG" button to generate your final image and
                save it to your browser's default download location (named
                `gifsmos.svg`). Note that a single frame will be exported in
                standard SVG (no animation).
              </p>
              <h3>Generating and downloading a MOV</h3>
              <p>
                You can also click on "Download MOV" to download a rasterized
                version of the SVG animation in transparent video format. The
                generated file is in MOV format (QuickTime) and is encoded using
                the PNG codec. This feature is useful if you want to embed the
                animation in a video (e.g. for YouTube) using a video editing
                software. Unlike the original GIFsmos, background transparency
                is preserved. Note that a single frame will be exported in PNG
                (image format). Also, processing time may be quite long (using
                ffmpeg.wasm in single-threaded mode for browser compatibility).
              </p>
            </OverlayScrollbarsComponent>
          </div>
        </div>
      </div>
    );
  }
}
