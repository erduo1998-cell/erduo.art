(() => {
  'use strict';
  const dialog = document.querySelector('.inquiry-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const options = {
    membership: ['加入耳朵开源实战社', '¥199 永久席位，获得所有开源项目的详细操作手册与群内公开交流。请先咨询首批余位。', '会员群', '咨询199元永久会员'],
    offline: ['咨询南京线下实操课', '3 天集中实操，¥5,980 / 人。了解近期班期、课纲与席位安排。', '线下课', '咨询南京线下实操课'],
    coaching: ['聊聊 AI 结果陪跑', '¥9,800 / 月，一对一推进真实业务。请带上你的业务、目标和当前卡点。', '私人陪跑', '咨询AI结果陪跑'],
    enterprise: ['沟通企业定制需求', '告诉我业务场景、现有流程和希望完成的结果。需求明确后，再评估范围与报价。', '企业定制', '咨询企业定制开发与服务'],
    general: ['和耳朵聊聊', '告诉我你希望用 AI 完成什么具体结果，我们一起找到适合你的方式。', '业务咨询', '业务合作咨询']
  };
  let trigger = null;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-inquiry]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const value = options[link.dataset.inquiry];
    if (!value) return;
    event.preventDefault();
    event.stopPropagation();
    trigger = link;
    dialog.querySelector('h2').textContent = value[0];
    dialog.querySelector('[data-inquiry-summary]').textContent = value[1];
    dialog.querySelector('[data-inquiry-keyword]').textContent = value[2];
    dialog.querySelector('[data-inquiry-email]').href = 'mailto:erduo1998@gmail.com?subject=' + encodeURIComponent(value[3]);
    dialog.showModal();
    document.documentElement.classList.add('inquiry-open');
    document.dispatchEvent(new CustomEvent('portfolio-modal', {detail: true}));
  }, true);
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('inquiry-open');
    document.dispatchEvent(new CustomEvent('portfolio-modal', {detail: false}));
    if (trigger?.isConnected) trigger.focus({preventScroll: true});
    trigger = null;
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
})();
