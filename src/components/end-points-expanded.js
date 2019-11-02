import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import '@/components/api-request';
import '@/components/api-response';
import FontStyles from '@/styles/font-styles';

export default class EndPointsExpanded extends LitElement {
  static get properties() {
    return {
      apiKeyName: { type: String, attribute: 'api-key-name' },
      apiKeyValue: { type: String, attribute: 'api-key-value' },
      apiKeyLocation: { type: String, attribute: 'api-key-location' },
      selectedServer: { type: String, attribute: 'selected-server' },
      layout: { type: String },
      paths: { type: Object },
      matchPaths: { type: String, attribute: 'match-paths' },
      allowTry: { type: String, attribute: 'allow-try' },
      renderStyle: { type: String, attribute: 'render-style' },
      schemaStyle: { type: String, attribute: 'schema-style' },
      defaultSchemaTab: { type: String, attribute: 'default-schema-tab' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
    };
  }

  /* eslint-disable indent */
  render() {
    return html`
      ${FontStyles}
      <style>
        .endpoint-body{
          padding:24px 0px;
        }
        .divider {
          border-top:2px solid var(--primary-color);
          width:100%;
        }
        @media only screen and (min-width: 768px) {
          .endpoint-body {
            padding:36px 0 48px 0;
          }
        }
      </style>  
      ${this.paths.map((path) => this.endpointBodyTemplate(path))}
    `;
  }

  endpointBodyTemplate(path) {
    return html`
    <div class='divider'></div>
    <div class='endpoint-body anchor ${path.method}' id='${path.method}${path.path.replace(/\//g, '')}' >
      ${html`
        <h1> ${path.summary || html`<span class='upper method-fg ${path.method}'> ${path.method}</span> ${path.path}`} </h1>
        ${path.summary
          ? html`
            <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg3)'> 
              <span class='regular-font upper bold-text method-fg ${path.method}'>${path.method}</span> 
              ${path.path} 
            </div>`
          : ''
        }
      `
      }
      ${path.description
          ? html`
              <div class="m-markdown"> 
                ${unsafeHTML(marked(path.description || ''))}
              </div>`
          : ''
      }
      <div class='req-resp-container'> 
        <api-request  class="request-panel"  
          method = "${path.method}", 
          path = "${path.path}" 
          api-key-name = "${this.apiKeyName}" 
          api-key-value = "${this.apiKeyValue}" 
          api-key-location = "${this.apiKeyLocation}" 
          selected-server = "${this.selectedServer}" 
          .parameters = "${path.parameters}" 
          .request_body = "${path.requestBody}"
          allow-try = "${this.allowTry}"
          accept = "${this.accept}"
          render-style="${this.renderStyle}" 
          schema-style = "${this.schemaStyle}"
          active-schema-tab = "${this.defaultSchemaTab}"
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
        > </api-request>
        <api-response
          class = 'response-panel'
          schema-style="${this.schemaStyle}"
          render-style="${this.renderStyle}"
          active-schema-tab = "${this.defaultSchemaTab}"
          .responses="${path.responses}"
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
        > </api-response>
      </div>
    </div>
    `;
  }
  /* eslint-enable indent */

  updated() {
    const observeTargetEls = this.shadowRoot.querySelectorAll('.endpoint-body');
    const added = new CustomEvent('added', {
      detail: observeTargetEls,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(added);
  }
}
// Register the element with the browser
customElements.define('end-points-expanded', EndPointsExpanded);