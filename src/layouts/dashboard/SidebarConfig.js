import { Icon, InlineIcon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import homeFilled from '@iconify/icons-ant-design/home-filled';
import baselineHome from '@iconify-icons/ic/baseline-home';
import reportIcon from '@iconify-icons/carbon/report';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Página Inicial',
    path: '/dashboard/app',
    icon: getIcon(homeFilled)
  },
  {
    title: 'Estagiários',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Relatórios',
    path: '/dashboard/relatorios',
    icon: getIcon(reportIcon)
  },
  {
    title: 'Supervisores',
    path: '/dashboard/supervisores',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Perfil',
    path: '/dashboard/perfilusuario',
    icon: getIcon(peopleFill)
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Entrar',
    path: '/login',
    icon: getIcon(lockFill)
  },
  {
    title: 'Cadastrar',
    path: '/register',
    icon: getIcon(personAddFill)
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon(alertTriangleFill)
  }
];

export default sidebarConfig;
