<?php

/**
 * @package     Joomla.Site
 * @subpackage  mod_liqpay
 *
 * @copyright   (C) 2022 Open Source Matters, Inc. <https://www.joomla.org>
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Extension\Service\Provider\HelperFactory;
use Joomla\CMS\Extension\Service\Provider\Module;
use Joomla\CMS\Extension\Service\Provider\ModuleDispatcherFactory;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;

/**
 * The article news module service provider.
 *
 * @since  4.2.0
 */
return new class implements ServiceProviderInterface
{
    /**
     * Registers the service provider with a DI container.
     *
     * @param   Container  $container  The DI container.
     *
     * @return  void
     *
     * @since   4.2.0
     */
	/**
	 * @param   \Joomla\DI\Container  $container
	 *
	 *
	 * @since version
	 */
	final public function register(Container $container): void
	{
		$container->registerServiceProvider(new ModuleDispatcherFactory('\\Joomla\\Module\\Liqpay'));
		$container->registerServiceProvider(new HelperFactory('\\Joomla\\Module\\Liqpay\\Site\\Helper'));
		$container->registerServiceProvider(new Module);
	}
};
