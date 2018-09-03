<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMSSerializer;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Item
 *
 * @ORM\Table(name="items")
 * @ORM\Entity(repositoryClass="App\Repository\ItemRepository")
 * @JMSSerializer\ExclusionPolicy("all")
 */
class Item implements \JsonSerializable
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @JMSSerializer\Expose
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="signature", type="string", length=32, unique=true)
     * @Assert\NotBlank(message="Please enter a signature")
     * @JMSSerializer\Expose
     */
    private $signature;

    /**
     * @var int
     *
     * @ORM\Column(name="status", type="integer")
     * @Assert\NotBlank(message="Please enter a status")
     * @JMSSerializer\Expose
     */
    private $status;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_action", type="datetime", nullable=true)
     * @JMSSerializer\Expose
     */
    private $lastAction;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set signature
     *
     * @param string $signature
     *
     * @return Item
     */
    public function setSignature($signature)
    {
        $this->signature = $signature;

        return $this;
    }

    /**
     * Get signature
     *
     * @return string
     */
    public function getSignature()
    {
        return $this->signature;
    }

    /**
     * Set status
     *
     * @param integer $status
     *
     * @return Item
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return int
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set lastAction
     *
     * @param \DateTime $lastAction
     *
     * @return Item
     */
    public function setLastAction($lastAction)
    {
        $this->lastAction = $lastAction;

        return $this;
    }

    /**
     * Get lastAction
     *
     * @return \DateTime
     */
    public function getLastAction()
    {
        return $this->lastAction;
    }
    
    public function jsonSerialize() {
        return $this->array;
    }    
    
}

