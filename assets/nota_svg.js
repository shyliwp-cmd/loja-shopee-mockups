// Ordem de Serviço / Nota de Balcão – Duplicar (v2). Gera um SVG a partir dos dados do pedido.
// Mesmo código no navegador (desenha em canvas e envia no WhatsApp) e no Node (arquivo p/ a pasta).
// notaSVG(P, thumbs) -> string SVG 1240x1754
// P = {numero, data, nome, endereco, cpf_cnpj, pedido_shopee, prazo, obs,
//      itens:[{qtd, tema, cor, nome_gravar, preco_unit}]}
// thumbs = [dataURL|null] (miniatura do copo na cor de cada item)
function notaSVG(P, thumbs = []) {
  const W = 1240, H = 1754, AZ = '#1f2a78', VM = '#e5322d', CZ = '#6b7280', LN = '#d7dbe6';
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const brl = v => Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const cut = (s, n) => { s = String(s ?? ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const F = "font-family=\"Arial, Helvetica, 'Liberation Sans', 'DejaVu Sans', sans-serif\"";
  const num = String(P.numero).padStart(3, '0');
  let o = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  o += `<rect width="${W}" height="${H}" fill="#fff"/>`;
  // ---------- cabeçalho
  o += `<g transform="translate(70,62)">
    <path d="M8 8 H72 A72 72 0 0 1 72 152 H8 Z" fill="none" stroke="${AZ}" stroke-width="16" stroke-linejoin="miter"/>
    <path d="M44 40 H70 A40 40 0 0 1 70 120 H58" fill="none" stroke="${AZ}" stroke-width="14"/>
    <path d="M44 40 V128" stroke="${AZ}" stroke-width="14"/>
    <text x="178" y="84" ${F} font-size="86" font-weight="400" letter-spacing="6" fill="${AZ}">DUPLICAR</text>
    <text x="180" y="122" ${F} font-size="28" font-weight="700" fill="#333">Gráfica Digital &amp;</text>
    <text x="180" y="156" ${F} font-size="28" font-weight="700" fill="#333">Comunicação Visual</text></g>`;
  o += `<g ${F} fill="#444" font-size="22"><text x="70" y="270">WhatsApp 31 99283-1522  •  Av. Serrano, 326 – Bairro Itatiaia – CEP 30882-370 – BH/MG</text>
    <text x="70" y="300">CNPJ 43.082.150/0001-02</text></g>`;
  o += `<rect x="830" y="50" width="340" height="190" rx="18" fill="#f5f6fb" stroke="${LN}" stroke-width="2"/>
    <text x="1000" y="100" ${F} font-size="30" font-weight="700" fill="${AZ}" text-anchor="middle">ORDEM DE SERVIÇO</text>
    <text x="1000" y="180" ${F} font-size="76" font-weight="700" fill="${VM}" text-anchor="middle">Nº ${num}</text>
    <text x="1000" y="222" ${F} font-size="24" fill="${CZ}" text-anchor="middle">Emissão: ${esc(P.data)}</text>`;
  o += `<rect x="70" y="330" width="1100" height="6" rx="3" fill="${AZ}"/>`;
  // ---------- cliente
  const lab = (x, y, t) => `<text x="${x}" y="${y}" ${F} font-size="20" font-weight="700" fill="${CZ}" letter-spacing="1">${t}</text>`;
  const val = (x, y, t, n, s = 32, w = 400) => `<text x="${x}" y="${y}" ${F} font-size="${s}" font-weight="${w}" fill="#111">${esc(cut(t, n))}</text>`;
  o += lab(70, 385, 'CLIENTE') + val(70, 425, P.nome, 40, 36, 700);
  o += lab(70, 475, 'ENDEREÇO DE ENTREGA') + val(70, 512, P.endereco, 62, 28);
  o += lab(70, 562, 'CPF / CNPJ') + val(70, 598, P.cpf_cnpj || '—', 22, 28);
  o += lab(420, 562, 'CANAL / PEDIDO') + val(420, 598, 'Shopee • ' + (P.pedido_shopee || '—'), 34, 28);
  // prazo
  o += `<rect x="900" y="360" width="270" height="140" rx="18" fill="${VM}"/>
    <text x="1035" y="405" ${F} font-size="22" font-weight="700" fill="#fff" text-anchor="middle" letter-spacing="1">POSTAR ATÉ</text>
    <text x="1035" y="470" ${F} font-size="52" font-weight="700" fill="#fff" text-anchor="middle">${esc(P.prazo || '—')}</text>`;
  o += `<rect x="70" y="630" width="1100" height="2" fill="${LN}"/>`;
  // ---------- itens (até 4 cartões)
  o += lab(70, 680, 'ITENS');
  let y = 700, total = 0, qt = 0;
  const its = P.itens.slice(0, 4);
  its.forEach((it, i) => {
    const sub = it.qtd * it.preco_unit; total += sub; qt += it.qtd;
    const h = 190, ok = it.nome_gravar && !/conferir/i.test(it.nome_gravar);
    o += `<rect x="70" y="${y}" width="1100" height="${h}" rx="16" fill="#fff" stroke="${LN}" stroke-width="2"/>`;
    if (thumbs[i]) o += `<image x="86" y="${y + 12}" width="150" height="166" preserveAspectRatio="xMidYMid slice" href="${thumbs[i]}" xlink:href="${thumbs[i]}"/>`;
    else o += `<rect x="86" y="${y + 12}" width="150" height="166" rx="10" fill="#eef0f6"/>`;
    o += `<text x="262" y="${y + 52}" ${F} font-size="34" font-weight="700" fill="${AZ}">${it.qtd}× Copo Térmico 473 ml – ${esc(cut(it.tema, 26))}</text>`;
    o += `<text x="262" y="${y + 92}" ${F} font-size="28" fill="#333">Cor: <tspan font-weight="700">${esc(it.cor)}</tspan>   •   ${it.qtd} × R$ ${brl(it.preco_unit)} = <tspan font-weight="700">R$ ${brl(sub)}</tspan></text>`;
    o += `<rect x="262" y="${y + 112}" width="890" height="62" rx="12" fill="${ok ? '#e9f8ef' : '#fff4d6'}" stroke="${ok ? '#2e9e5b' : '#e0a100'}" stroke-width="2"/>`;
    o += `<text x="282" y="${y + 153}" ${F} font-size="22" font-weight="700" fill="${CZ}">GRAVAR:</text>`;
    o += `<text x="400" y="${y + 155}" ${F} font-size="34" font-weight="700" fill="#111">${esc(cut(ok ? it.nome_gravar : '⚠ sem nome – conferir no chat', 38))}</text>`;
    y += h + 18;
  });
  if (P.itens.length > 4) { o += `<text x="70" y="${y + 10}" ${F} font-size="24" fill="${VM}">+ ${P.itens.length - 4} item(ns) – ver pedido na Shopee</text>`; y += 30; }
  P.itens.slice(4).forEach(it => { total += it.qtd * it.preco_unit; qt += it.qtd; });
  // ---------- total
  y += 6;
  o += `<rect x="70" y="${y}" width="1100" height="120" rx="16" fill="${AZ}"/>
    <text x="104" y="${y + 72}" ${F} font-size="28" font-weight="700" fill="#c9cff5" letter-spacing="1">TOTAL • ${qt} ${qt === 1 ? 'COPO' : 'COPOS'}</text>
    <text x="1136" y="${y + 80}" ${F} font-size="60" font-weight="700" fill="#fff" text-anchor="end">R$ ${brl(total)}</text>`;
  y += 170;
  // ---------- produção (linha única)
  o += lab(70, y, 'PRODUÇÃO');
  ['Nome conferido', 'Gravado', 'Embalado', 'Postado'].forEach((t, i) => {
    const x = 70 + i * 275;
    o += `<rect x="${x}" y="${y + 22}" width="32" height="32" rx="6" fill="none" stroke="#666" stroke-width="3"/>
      <text x="${x + 46}" y="${y + 48}" ${F} font-size="26" fill="#222">${t}</text>`;
  });
  y += 90;
  if (P.obs) { o += lab(70, y + 10, 'OBSERVAÇÕES') + `<text x="70" y="${y + 50}" ${F} font-size="26" fill="#333">${esc(cut(P.obs, 80))}</text>`; y += 80; }
  const Hf = y + 70;
  o += `<text x="${W / 2}" y="${Hf - 30}" ${F} font-size="19" fill="${CZ}" text-anchor="middle">Gerada automaticamente a partir do pedido Shopee • confira o nome antes de gravar • não é documento fiscal</text>`;
  o = o.replace(/^<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${Hf}" viewBox="0 0 ${W} ${Hf}">`);
  o = o.replace(`<rect width="${W}" height="${H}" fill="#fff"/>`, `<rect width="${W}" height="${Hf}" fill="#fff"/>`);
  return o + '</svg>';
}
if (typeof module !== 'undefined') module.exports = { notaSVG };
